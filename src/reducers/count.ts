import { AnyAction } from "../types/actions";

interface CountState {
   count: number;
}

const INIT_STATE: CountState = {
   count: 3,
};

export default (state = INIT_STATE, action: AnyAction): CountState => {
   switch (action.type) {
      case "INCREASE":
         console.log("in");
         console.log(state.count);
         return { ...state, count: state.count + 1 };
      default:
         return state;
   }
};
