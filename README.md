## TINYHOUSE

### TypeScript

#### ts config

[ts config](https://www.typescriptlang.org/docs/handbook/compiler-options.html)

#### How to watch and reload ts-node when TypeScript files change

```json
{
  "scripts": {
    "start": "nodemon src/index.ts"
  }
}
```

This is it!
[nodemon and ts-node](https://github.com/remy/nodemon/pull/1552/commits/1272dab17501c12bdf6fd6621741a4b8d3854e78)

#### tsc

By invoking `tsc` with no input files and a `--project` (or just `-p`) command line option that specifies the path of a directory containing a `tsconfig.json` file, or a path to a valid .json file containing the configurations.

```bash
tsc -p ./
```

### eslint

[typescript-eslint](https://github.com/typescript-eslint/typescript-eslint)

### curl

[man page](https://curl.haxx.se/docs/manpage.html)

### GraphQL

- intuitive: client specifies exactly what data it needs
- performant: no useless data needs to be transferred
- typed: every field in the schema is type-defined
- self-documenting
- single endpoint

#### Resolver

- Arguments
  - obj - object returned from the parent resolver
  - args - arguments provides to the field
  - context - value provided to every resolver
  - info - info about the execution state of the query

> [Proxying API Requests in Development](https://create-react-app.dev/docs/proxying-api-requests-in-development/)
