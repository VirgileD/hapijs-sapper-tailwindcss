// these packages have no type declaration so vscode complains
// Could not find a declaration file for module 'blipp'. '/home/virgiled/Projects/hapijs-sapper-tailwindcss/backend/node_modules/blipp/lib/index.js' implicitly has an 'any' type.
// Try `npm i --save-dev @types/blipp` if it exists or add a new declaration (.d.ts) file containing `declare module 'blipp';`ts(7016)
// the jsonfig.json declares this file to declare the new declarations in addition to "./node_modules/@types"
declare module 'blipp';
declare module 'wurst';
declare module 'configue';
declare module 'aguid';
declare module 'nconf-yaml';

