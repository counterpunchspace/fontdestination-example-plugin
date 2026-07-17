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
