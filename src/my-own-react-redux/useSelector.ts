import { useReducer, useRef, useEffect } from "react";
import { useReduxContext } from "./useReduxContext";

type Selector<State, Selected> = (state: State) => Selected;
type EqualityFn<Selected> = (a: Selected | undefined, b: Selected | undefined) => boolean;

const defaultEqualityFn = <T>(a: T, b: T) => a === b;

/**
 * useSelector 會去訂閱 store 的變化, 若發生變化會用 equalityFn 來判斷是否要 re-render, 並 return selector 的 state
 *
 * @param selector
 * @param equalityFn
 * @returns state
 */
export function useSelector<State, Selected>(
   selector: Selector<State, Selected>,
   equalityFn: EqualityFn<Selected> = defaultEqualityFn
) {
   const { store } = useReduxContext();

   // 強制更新元件 , 此處用 useState 可有一樣效果
   const [, forceRender] = useReducer((s) => s + 1, 0);

   const latestSelectedState = useRef<Selected>();
   const selectedState = selector(store.getState());

   // 用 equalityFn 來判斷是否
   function checkForUpdates() {
      const newSelectedState = selector(store.getState());

      if (equalityFn(newSelectedState, latestSelectedState.current)) {
         return;
      }

      latestSelectedState.current = newSelectedState;
      forceRender();
   }

   useEffect(() => {
      const unsubscribe = store.subscribe(checkForUpdates);

      return unsubscribe;
   }, []);

   return selectedState;
}
