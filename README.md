# ΞXTΞND

ΞXTΞND is a Chrome browser extension that aims to bring the power of Ethereum blockchain to various social websites such as reddit. This is accomplished by making slight modifications to certain web pages (such as adding “tip” button to reddit posts) while having an Ethereum light client integrated into the extension. In the initial release, a user can send tips to other reddit users or buy them reddit gold with ETH directly. Check more about ΞXTΞND [here.](https://blog.decenter.com/2017/11/14/extend/) 

## Building locally

 - Install local dependencies with `yarn`.
 - Install gulp globally with `npm install -g gulp`.

### Development build

 - Build local config file for development  with `gulp init-dev`
 - Build the unoptimized project to the `./build/` folder with `gulp`.
 - Optionally, to rebuild on file changes, run `gulp watch`.

### Production build
 - Build config file for production with `gulp init-prod`
 - Build the optimized project to the `./build/` folder with `gulp prod`.
