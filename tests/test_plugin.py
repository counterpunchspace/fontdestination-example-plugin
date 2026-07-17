import unittest

from binaryfontconsumer_example_plugin import FontDestinationPlugin


class FontDestinationPluginTest(unittest.TestCase):
    def test_metadata_describes_a_secure_destination(self) -> None:
        metadata = FontDestinationPlugin().metadata()

        self.assertEqual(metadata["pluginId"], "example-binary-font-consumer")
        self.assertEqual(metadata["targetOrigin"], "https://yanone.github.io")
        self.assertTrue(metadata["destinationUrl"].startswith(metadata["targetOrigin"]))


if __name__ == "__main__":
    unittest.main()
