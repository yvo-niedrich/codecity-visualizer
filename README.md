# CodeCityVisualizer
![CodeCityVisualizer-Logo][logo-image]

[![Travis Banner][travis-banner]][travis-link]
[![npm version](https://badge.fury.io/js/codecity-visualizer.svg)](https://badge.fury.io/js/codecity-visualizer)

Code cities convert your complex Software into a picture, for everyone to understand.

This fully customizable library contains a collection of experimantal, as well as proven algorithms and layouts.

For more information check out the [Git-Repository][git-project] or see how to start using the library with the [Boostrap-Project][boot-project].

Available in ES2015-CommonJS _(supports TypeScript Typehints)_.

## Polyfills
This plugin is deployed in the ES2015-Syntax, but still requires polyfills, depending on your interpreter. For minimal polyfilling (tested with IE11 / Node v3) use `core-js`:
 * core-js/fn/set
 * core-js/fn/array/index-of
 * core-js/fn/array/is-array
 * core-js/fn/object/get-own-property-descriptor
 * core-js/fn/object/get-own-property-descriptors
 * core-js/fn/object/get-own-property-names
 * core-js/fn/object/get-own-property-symbols

## Demo
To see this library in action check out the SonarQube-Plugin [Softvis3D][softvis3d].<br /> _(Also available at the "SonarQube Update Center")_

[//]: #
  [travis-banner]: https://travis-ci.org/Ungolianth/codecity-visualizer.svg?branch=master
  [travis-link]: https://travis-ci.org/Ungolianth/codecity-visualizer/branches
  [npm-banner]: https://badge.fury.io/js/codecity-visualizer.svg
  [npm-link]: https://www.npmjs.com/package/codecity-visualizer
  [logo-image]: https://raw.githubusercontent.com/Ungolianth/codecity-visualizer/master/ccv.png "CCV-Logo"
  [git-project]: https://github.com/Ungolianth/codecity-visualizer.git
  [boot-project]: http://git.ungolianth.de/ungolianth/ccv-bootstrap.git
  [softvis3d]: http://softvis3d.com/