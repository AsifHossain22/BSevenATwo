# Project Set Up

- Installation:
  1. npm init --y
  2. npm i -D typescript
  3. npx tsc --init

- Typescript Config File:
  1. File Layout: Uncomment - "rootDir" & "outDir"
  2. Environment Settings - module: "esnext", types: "node"
  3. Recommended Options - Comment - "jsx"

- Package.JSON File:
  1. type: "module"

- Express Installation: npm install express
  1. Copy template from Express
  2. Remove 'require' and add 'import'
  3. Install - npm i --save-dev @types/express (for type safety)

- Install: NPM tsx - npm install -D npx

- Package.JSON File:
  1. scripts - "dev": "tsx watch ./src/server.ts"
