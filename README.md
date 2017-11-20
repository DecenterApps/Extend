# ΞXTΞND

ΞXTΞND is a Chrome browser extension that aims to bring the power of Ethereum blockchain to various social websites such as reddit. This is accomplished by making slight modifications to certain web pages (such as adding “tip” button to reddit posts) while having an Ethereum light client integrated into the extension. In the initial release, a user can send tips to other reddit users or buy them reddit gold with ETH directly.

## To Run
Clone or download this repo.

Navigate to an example's root folder, then run

```
yarn 
```

To build the project, run 

```
gulp
```

And webpack bundle will be created. 

In the root project directory, you will find a `build` folder. To install the extension in chrome, go to chrome://extensions on your browser, make sure developer mode is enabled, and click on "Load unpacked extension...". Select the `build` directory and you're on you're way!
