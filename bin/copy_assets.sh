#!/bin/sh

cp LICENSE dist/fingerprintjs-pro-angular
cp README.md dist/fingerprintjs-pro-angular
cp CHANGELOG.md dist/fingerprintjs-pro-angular

# Remove publishConfig.directory from dist package.json — it's only needed in the source
# to tell pnpm/changeset to publish from this dist directory.
node -e "
  const fs = require('fs');
  const pkg = JSON.parse(fs.readFileSync('dist/fingerprintjs-pro-angular/package.json', 'utf8'));
  delete pkg.publishConfig.directory;
  fs.writeFileSync('dist/fingerprintjs-pro-angular/package.json', JSON.stringify(pkg, null, 2) + '\n');
"
