# Example Font Destination

A reference Counterpunch Font Destination package and GitHub Pages receiver.

The package publishes the `counterpunch_font_destination_plugins` entry point.
Its root `counterpunch-plugin.json` advertises the discovery marker:

```text
counterpunch-plugin:font-destination:v1
```

The Pages receiver waits for a `counterpunch:binary-font-exported` message and
shows basic sfnt information from the transferred binary font.

The page is available at https://counterpunchspace.github.io/fontdestination-example-plugin/ but in order to function, it needs to be opened from within Counterpunch, hence the detour via the plugin.

The `window.postMessage` mechanism that is used to transfer the font asset between Counterpunch and the listener is only functional if one page has been opened via an explicit user action from within another. That’s a browser security feature.

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
