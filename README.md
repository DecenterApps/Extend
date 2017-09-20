# Reddapp
Chrome extension that lets users integrate with smart contract for upvoting/downvoting posts/comments

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