import json
import unittest
from pathlib import Path

from fontdestination_example_plugin import FontDestinationPlugin


class FontDestinationPluginTest(unittest.TestCase):
    def test_metadata_describes_a_secure_destination(self) -> None:
        metadata = FontDestinationPlugin().metadata()

        self.assertEqual(
            metadata["pluginId"],
            "io.github.counterpunchspace.example-font-destination",
        )
        self.assertEqual(
            metadata["targetOrigin"], "https://counterpunchspace.github.io"
        )
        self.assertTrue(metadata["destinationUrl"].startswith(metadata["targetOrigin"]))

    def test_manifest_matches_plugin_metadata(self) -> None:
        manifest_path = Path(__file__).parent.parent / "counterpunch-plugin.json"
        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
        metadata = FontDestinationPlugin().metadata()

        plugin = manifest["plugins"][0]
        self.assertEqual(plugin["entryPoint"], "example_fontdestination")
        self.assertEqual(plugin["contract"], "font_destination:v1")
        for key in (
            "pluginId",
            "name",
            "description",
            "destinationUrl",
            "targetOrigin",
            "repositoryUrl",
        ):
            self.assertEqual(plugin[key], metadata[key])


if __name__ == "__main__":
    unittest.main()
