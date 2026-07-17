"""Metadata exposed to Counterpunch through Python entry-point discovery."""


class FontDestinationPlugin:
    """Describe the example browser receiver without handling font bytes itself."""

    plugin_id = "example-font-destination"
    name = "Example Font Destination"
    description = (
        "Opens a small browser receiver that displays basic information about "
        "each exported binary font."
    )
    destination_url = "https://counterpunchspace.github.io/fontdestination-example-plugin/"
    target_origin = "https://counterpunchspace.github.io"
    repository_url = "https://github.com/counterpunchspace/fontdestination-example-plugin"
    icon_url = None

    def metadata(self) -> dict[str, str | None]:
        """Return serializable metadata used by Counterpunch's Tools menu."""
        return {
            "pluginId": self.plugin_id,
            "name": self.name,
            "description": self.description,
            "destinationUrl": self.destination_url,
            "targetOrigin": self.target_origin,
            "repositoryUrl": self.repository_url,
            "iconUrl": self.icon_url,
        }
