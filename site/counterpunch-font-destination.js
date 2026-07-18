(function () {
  // Keep this list narrow. These are the only editor origins allowed to send
  // binary font exports to this receiver.
  const DEFAULT_EDITOR_ORIGINS = [
    "https://editor.counterpunch.space",
    "https://preview.editor.counterpunch.space",
    "https://localhost:8000",
    "https://localhost:8789",
  ];

  function isBinaryFontExport(message) {
    return (
      message &&
      message.type === "counterpunch:binary-font-exported" &&
      message.version === 1 &&
      message.bytes instanceof ArrayBuffer
    );
  }

  function register(options) {
    const editorOrigins = new Set(
      options.editorOrigins || DEFAULT_EDITOR_ORIGINS,
    );
    const onFont = options.onFont;

    window.addEventListener("message", (event) => {
      // Validate by origin and payload shape. Do not compare
      // event.source with window.parent; COOP/COEP can proxy it.
      if (!editorOrigins.has(event.origin)) {
        return;
      }

      const message = event.data;
      if (!isBinaryFontExport(message)) {
        return;
      }

      onFont({
        bytes: message.bytes,
        metadata: message.metadata || {},
        origin: event.origin,
        rawMessage: message,
      });
    });

    if (window.parent !== window) {
      // Tell Counterpunch's bridge it can deliver queued exports.
      for (const editorOrigin of editorOrigins) {
        window.parent.postMessage(
          {
            type: "counterpunch:font-destination-ready",
            version: 1,
          },
          editorOrigin,
        );
      }
    }
  }

  window.CounterpunchFontDestination = {
    defaultEditorOrigins: DEFAULT_EDITOR_ORIGINS,
    register,
  };
})();
