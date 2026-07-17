# Example Binary Font Consumer

A reference Counterpunch Font Destination package and GitHub Pages receiver.

The package publishes the `counterpunch_font_destination_plugins` entry point.
Its root `counterpunch-plugin.json` advertises the discovery marker:

```text
counterpunch-plugin:font-destination:v1
```

The Pages receiver waits for a `counterpunch:binary-font-exported` message and
shows basic sfnt information from the transferred binary font.
