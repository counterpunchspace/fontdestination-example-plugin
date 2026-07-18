const statusElement = document.getElementById('font-status');
const statusDot = document.getElementById('status-dot');
const detailsElement = document.getElementById('font-details');
let receiptCount = 0;

// Demo rendering only. The Counterpunch protocol lives in
// counterpunch-font-destination.js so third-party receivers can reuse it.

function readTag(view, offset) {
    return String.fromCharCode(
        view.getUint8(offset),
        view.getUint8(offset + 1),
        view.getUint8(offset + 2),
        view.getUint8(offset + 3)
    );
}

function decodeName(view, offset, length, platformId) {
    const bytes = new Uint8Array(view.buffer, view.byteOffset + offset, length);
    if (platformId === 0 || platformId === 3) {
        let text = '';
        for (let index = 0; index + 1 < bytes.length; index += 2) {
            text += String.fromCharCode((bytes[index] << 8) | bytes[index + 1]);
        }
        return text;
    }
    return new TextDecoder('latin1').decode(bytes);
}

function parseNameRecords(view, tableOffset) {
    const count = view.getUint16(tableOffset + 2);
    const stringOffset = view.getUint16(tableOffset + 4);
    const records = new Map();
    for (let index = 0; index < count; index += 1) {
        const offset = tableOffset + 6 + index * 12;
        const platformId = view.getUint16(offset);
        const nameId = view.getUint16(offset + 6);
        const length = view.getUint16(offset + 8);
        const relativeOffset = view.getUint16(offset + 10);
        if (!records.has(nameId)) {
            records.set(nameId, decodeName(view, tableOffset + stringOffset + relativeOffset, length, platformId));
        }
    }
    return records;
}

function inspectFont(buffer) {
    const view = new DataView(buffer);
    if (view.byteLength < 12) throw new Error('The exported file is too small to be an sfnt font.');
    const tableCount = view.getUint16(4);
    const tables = new Map();
    for (let index = 0; index < tableCount; index += 1) {
        const offset = 12 + index * 16;
        tables.set(readTag(view, offset), {
            offset: view.getUint32(offset + 8),
            length: view.getUint32(offset + 12)
        });
    }
    const head = tables.get('head');
    const maxp = tables.get('maxp');
    const name = tables.get('name');
    const names = name ? parseNameRecords(view, name.offset) : new Map();
    return {
        sfntVersion: readTag(view, 0),
        tableCount,
        tables: [...tables.keys()].sort().join(', '),
        unitsPerEm: head ? view.getUint16(head.offset + 18) : 'Unavailable',
        glyphCount: maxp ? view.getUint16(maxp.offset + 4) : 'Unavailable',
        familyName: names.get(1) || 'Unavailable',
        fullName: names.get(4) || 'Unavailable'
    };
}

function renderDetails(details) {
    detailsElement.replaceChildren(
        ...Object.entries(details).map(([label, value]) => {
            const row = document.createElement('div');
            const term = document.createElement('dt');
            const definition = document.createElement('dd');
            term.textContent = label;
            definition.textContent = String(value);
            row.append(term, definition);
            return row;
        })
    );
}

window.CounterpunchFontDestination.register({
    onFont({ bytes, metadata }) {
        receiptCount += 1;
        const receiptDetails = {
            'Receipt number': receiptCount,
            'Received at': new Date().toLocaleTimeString(),
            'Counterpunch change version': metadata.changeVersion ?? 'Unavailable',
            'File name': metadata.filename || 'Unavailable',
            'Byte size': metadata.byteLength || bytes.byteLength
        };
        statusDot.classList.add('received');

        try {
            const inspection = inspectFont(bytes);
            statusElement.textContent = metadata.filename || 'Font received';
            renderDetails({
                ...receiptDetails,
                'sfnt version': inspection.sfntVersion,
                'Family name': inspection.familyName,
                'Full name': inspection.fullName,
                'Units per em': inspection.unitsPerEm,
                'Glyph count': inspection.glyphCount,
                'Tables': inspection.tables
            });
        } catch (error) {
            statusElement.textContent = 'Unable to inspect font';
            renderDetails({
                ...receiptDetails,
                Error: error instanceof Error ? error.message : String(error)
            });
        }
    }
});
