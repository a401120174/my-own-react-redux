import { useReduxContext } from "./useReduxContext";
import { Dispatch } from "../types/store";
import { Action } from "../types/actions";

export function useDispatch<A extends Action>() {
   const { store } = useReduxContext();
   return store.dispatch as Dispatch<A>;
}
