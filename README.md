# wot-typescript-definitions
A typescript definition file for the WoT scripting API as used in thingweb

## Notes on usage

These definitions are imported using npm. Once we reach conclusion on the API in the W3C Web of Things task force, we will add this to definatelytyped.

## ES5 targets

As consumers are using typescript we target ES6.
When implementing for ES5 targets, be sure to provide a polyfill for ES6 Promises, either ``es6-promise`` from npm or add the lib ``es2015.promise`` to your tsc command when transpiling typescript.