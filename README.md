## About
A simple tic tac toe game built initially from the React website tutorial bootstrapped with the Create React App toolchain. 

Optimizations and other notable differences from the React website final product include:
- Project has been completely re-written to utilize only function components rather than classes with the useReducer hook as is the modern standard for managing complex state--for reference a useState hook version is also in the archives file
- Move list displays column, row, move number and player ID, and the selected button appears in bold
- Board component uses two loops to make squares instead of hardcoding
- classNames utility has been incorporated from NPM to facilitate dynamic conditional stylings on render
- A toggle button has been added that lets the user sort moves in ascending or descending order
- When someone wins, the three squares that caused the win are highlighted in blue
- When no one wins, a message about the result being a draw is displayed
- The calculateWinner function has been modified to return an object containing both the identify of the winner and the winning squares, and this information has been added to the App state to avoid calculateWinner being called too many times

## Install and Run
Clone the repository, then, in the directory, run:
```
npm install
```
Then, to deploy to local host:
```
npm start
```

## Deployment
Additional efforts were taken to integrate the React JS application with a HTML page on my Python-Flask website. You can read about these steps [here](https://stackoverflow.com/a/61907504/12449272).
