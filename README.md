# Example Font Destination

A reference Counterpunch Font Destination package and GitHub Pages receiver.
Use this repository as a template for websites that want to receive the binary
font produced by **File > Export binary font**.

The package publishes the `counterpunch_font_destination_plugins` entry point.
Its root `counterpunch-plugin.json` advertises the discovery marker:

```text
counterpunch-plugin:font-destination:v1
```

The Pages receiver waits for a `counterpunch:binary-font-exported` message and
shows receipt information plus basic sfnt information from the transferred
binary font.

The page is available at https://counterpunchspace.github.io/fontdestination-example-plugin/ but in order to function, it needs to be opened from within Counterpunch, hence the detour via the plugin.

Counterpunch cannot just open an arbitrary receiver and use `window.opener`
directly. The editor is cross-origin isolated for WASM performance features,
and browsers protect that isolation by severing or proxying cross-origin opener
relationships. Counterpunch opens a same-origin bridge page instead; that
bridge embeds this receiver in a `credentialless` iframe and forwards the font
after the receiver sends a ready message.

## Reusing The Receiver Code

Copy `site/counterpunch-font-destination.js` into your receiver website and
register one callback:

```html
<script src="counterpunch-font-destination.js"></script>
<script>
  CounterpunchFontDestination.register({
    onFont({ bytes, metadata }) {
      // bytes is an ArrayBuffer containing the exported font.
      // metadata.filename, metadata.byteLength, metadata.format,
      // metadata.mimeType, metadata.changeVersion, and
      // metadata.timeTakenMs describe the export.
    },
  });
</script>
```

The helper validates the editor origin, message type, protocol version, and
transferred `ArrayBuffer`, then sends
`counterpunch:font-destination-ready` to supported Counterpunch editor origins.
Do not add an `event.source === window.parent` check; cross-origin isolation can
proxy that value even for valid bridge messages.

The demo-specific code in `site/app.js` is intentionally separate. Replace it
with your own upload, preview, validation, or publishing workflow.

## Files To Customize

- `counterpunch-plugin.json`: discovery metadata and release asset rules.
- `src/fontdestination_example_plugin/plugin.py`: Python entry point metadata
  returned to Counterpunch after installation.
- `site/plugin-preview.png`: optional 2:1 Plugin Manager preview image. Replace
  it with a screenshot of your receiver app and keep `imageUrl` pointed at the
  deployed GitHub Pages PNG, not a GitHub `blob` page.
- `site/`: the browser receiver. Keep the reusable helper or replace it with
  equivalent protocol handling.

Keep `counterpunch-plugin.json` and `plugin.py` in sync. The manifest is used
before installation, while the Python metadata is used after the wheel is
installed into Counterpunch's Pyodide runtime.

## Release

Update `version` in `pyproject.toml`, commit the release, then create and push a
matching version tag:

```sh
git add pyproject.toml
git commit -m "Release v0.1.0"
git tag v0.1.0
git push origin main --tags
```

Pushing a tag beginning with `v` runs the release workflow. It tests the
package, builds the wheel, writes its SHA-256 checksum, and creates a GitHub
release containing both files and `counterpunch-plugin.json`.

The GitHub Pages receiver deploys separately when changes under `site/` are
pushed to `main`.
