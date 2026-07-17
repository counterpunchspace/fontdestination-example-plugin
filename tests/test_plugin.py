import json
import unittest
from pathlib import Path

from fontdestination_example_plugin import FontDestinationPlugin


class FontDestinationPluginTest(unittest.TestCase):
    def test_metadata_describes_a_secure_destination(self) -> None:
        metadata = FontDestinationPlugin().metadata()

        self.assertEqual(metadata["pluginId"], "example-font-destination")
        self.assertEqual(
            metadata["targetOrigin"], "https://counterpunchspace.github.io"
        )
        self.assertTrue(metadata["destinationUrl"].startswith(metadata["targetOrigin"]))

    def test_manifest_matches_plugin_metadata(self) -> None:
        manifest_path = Path(__file__).parent.parent / "counterpunch-plugin.json"
        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
        metadata = FontDestinationPlugin().metadata()

        self.assertEqual(
            manifest["fontDestination"]["entryPoint"], "example_fontdestination"
        )
        for key in (
            "pluginId",
            "name",
            "description",
            "destinationUrl",
            "targetOrigin",
            "repositoryUrl",
        ):
            self.assertEqual(manifest["fontDestination"][key], metadata[key])
        self.assertEqual(
            manifest["release"]["wheelAssetPrefix"],
            "fontdestination_example_plugin-",
        )


if __name__ == "__main__":
    unittest.main()
