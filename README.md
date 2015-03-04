# pre-release - pre-alpha - untested
---
# Forte community library for Node.js

Pull requests welcome. Please write tests.

Ensure the PR conforms to the `.jscsrc` and `.jshintrc`.

# Usage


```javascript
var Forte = require('forte');
var forte = new Forte()
            .setAuthHeader('setAuthHeader')
            .setBasicAuth('username', 'password');

forte.setDevmode(); // to use the sandbox endpoint

forte.ping(function (err, body) {
    if (err) {
        console.error(err);
    } else {
        console.log(body);
    }
});

```

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
