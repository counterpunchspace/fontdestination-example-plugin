"""Metadata exposed to Counterpunch through Python entry-point discovery."""


class FontDestinationPlugin:
    """Describe the example browser receiver without handling font bytes itself."""

    # Keep these values in sync with counterpunch-plugin.json. Counterpunch uses
    # this metadata after installing the wheel to populate Tools > Font Destinations.
    plugin_id = "example-font-destination"
    name = "Example Font Destination"
    description = (
        "Opens a small browser receiver that displays basic information about "
        "each exported binary font."
    )
    destination_url = "https://counterpunchspace.github.io/fontdestination-example-plugin/"
    target_origin = "https://counterpunchspace.github.io"
    repository_url = "https://github.com/counterpunchspace/fontdestination-example-plugin"
    image_url = "https://counterpunchspace.github.io/fontdestination-example-plugin/plugin-preview.png"

    def metadata(self) -> dict[str, str | None]:
        """Return serializable metadata used by Counterpunch's Tools menu."""
        return {
            "pluginId": self.plugin_id,
            "name": self.name,
            "description": self.description,
            "destinationUrl": self.destination_url,
            "targetOrigin": self.target_origin,
            "repositoryUrl": self.repository_url,
            "imageUrl": self.image_url,
        }
