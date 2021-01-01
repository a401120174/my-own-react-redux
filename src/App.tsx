import React from "react";
import { Dispatch } from "./types/store";

import "./App.css";

import rootReducer from "./reducers/count";
import createStore from "./my-own-redux/createStore";
import applyMiddleware from "./my-own-redux/applyMiddleware";

import Provider from "./my-own-react-redux/Provider";

import Counter from "./components/Counter";

const logger1 = () => {
   return (next: Dispatch) => (action: any) => {
      console.log("dispatch 1");
      return next(action);
   };
};

const logger2 = () => {
   return (next: Dispatch) => (action: any) => {
      console.log("dispatch 2");
      return next(action);
   };
};

const store = createStore(rootReducer, applyMiddleware(logger1, logger2));

function App() {
   return (
      <Provider store={store}>
         <Counter />
      </Provider>
   );
}

export default App;
