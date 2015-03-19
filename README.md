# pre-release - pre-alpha - untested
---
# Forte community library for Node.js

See the
[Forte Web Service docs](https://www.forte.net/devdocs/api_resources/forte_api.htm)
for help.

Pull requests welcome. Please write tests.

Ensure the PR conforms to the JSCS and JSHint standards.

```bash
npm run jscs
npm run jshint
```

# Usage

```javascript
var Forte = require('forte');
var credentials = require('./test/credentials.example.json');
var forte = new Forte(credentials);

forte.setDevmode(); // to use the sandbox endpoint

```

See the tests in `./test/functional/` for common usage.


# Testing

```bash
npm run unit
npm run functional
npm test # everything
```

## Debugging

Run with `DEBUG=forte*` environment variable.

```bash
DEBUG=forte* npm test
```
