# Omarchy Plugins

An independent community registry for Omarchy Quattro plugins. Public submissions, automated checks, exact-commit release receipts, and a static catalogue.

Anyone can submit a public GitHub plugin. Repository owners can publish without a manual review queue; other maintainers prove write access with a file in the submitted commit. Automated checks are not a security audit.

## Development

Python 3.12+ is the only build dependency.

```sh
python -m unittest discover -s tests
python scripts/build.py
python -m http.server 8000 --directory _site
```

See [publishing](PUBLISHING.md), [security](SECURITY.md), and [architecture](ARCHITECTURE.md).

This project is independent and is not affiliated with or endorsed by Omarchy.
