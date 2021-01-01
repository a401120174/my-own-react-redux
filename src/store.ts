import rootReducer from "./reducers/count";
import createStore from "./my-own-redux/createStore";

interface CountState {
   count: number;
}

interface CountAction {
   type: string;
   count: number;
}

const store = createStore<CountState, CountAction>(rootReducer);
