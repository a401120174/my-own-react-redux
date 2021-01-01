import {
   Store,
   PreloadedState,
   StoreEnhancer,
   Dispatch,
   ExtendState,
} from "../types/store";
import { Action } from "../types/actions";
import { Reducer } from "../types/reducers";

import ActionTypes from "./utils/actionTypes";
import isPlainObject from "./utils/isPlainObject";

/**
 * 建立 Redux store 保存整個 state,  return store包含dispatch , subscribe , getState 3 個 method
 *
 * @param reducer A function that returns the next state tree, given
 * the current state tree and the action to handle.
 *
 * @param preloadedState The initial state. You may optionally specify it
 * to hydrate the state from the server in universal apps, or to restore a
 * previously serialized user session.
 * If you use `combineReducers` to produce the root reducer function, this must be
 * an object with the same shape as `combineReducers` keys.
 *
 * @param enhancer The store enhancer. You may optionally specify it
 * to enhance the store with third-party capabilities such as middleware,
 * time travel, persistence, etc. The only store enhancer that ships with Redux
 * is `applyMiddleware()`.
 *
 * @returns A Redux store that lets you read the state, dispatch actions
 * and subscribe to changes.
 */
export default function createStore<S, A extends Action, Ext = {}, StateExt = never>(
   reducer: Reducer<S, A>,
   enhancer?: StoreEnhancer<Ext, StateExt>
): Store<ExtendState<S, StateExt>, A, StateExt, Ext> & Ext;
export default function createStore<S, A extends Action, Ext = {}, StateExt = never>(
   reducer: Reducer<S, A>,
   preloadedState?: PreloadedState<S>,
   enhancer?: StoreEnhancer<Ext, StateExt>
): Store<ExtendState<S, StateExt>, A, StateExt, Ext> & Ext;
export default function createStore<S, A extends Action, Ext = {}, StateExt = never>(
   reducer: Reducer<S, A>,
   preloadedState?: PreloadedState<S> | StoreEnhancer<Ext, StateExt>,
   enhancer?: StoreEnhancer<Ext, StateExt>
): Store<ExtendState<S, StateExt>, A, StateExt, Ext> & Ext {
   //如果第二個參數是 function 且沒有第三個參數, 將第二個參數視為 enhancer
   if (typeof preloadedState === "function" && typeof enhancer === "undefined") {
      enhancer = preloadedState as StoreEnhancer<Ext, StateExt>;
      preloadedState = undefined;
   }

   if (typeof enhancer !== "undefined") {
      if (typeof enhancer !== "function") {
         throw new Error("Expected the enhancer to be a function.");
      }

      //執行 enhancer 並將 createStore 作為參數傳入 (enhancer 內必須 create 一個 Store)
      return enhancer(createStore)(reducer, preloadedState as PreloadedState<S>) as Store<
         ExtendState<S, StateExt>,
         A,
         StateExt,
         Ext
      > &
         Ext;
   }

   if (typeof reducer !== "function") {
      throw new Error("Expected the reducer to be a function.");
   }

   let currentReducer = reducer;
   let currentState = preloadedState as S;
   let nextListeners: (() => void)[] = [];
   let isDispatching = false;

   /**
    * 取得state
    *
    * @returns The current state tree of your application.
    */
   function getState(): S {
      if (isDispatching) {
         throw new Error(
            "You may not call store.getState() while the reducer is executing. " +
               "The reducer has already received the state as an argument. " +
               "Pass it down from the top reducer instead of reading it from the store."
         );
      }

      return currentState as S;
   }

   /**
    * 傳入 listener function, 將此 listener 加入到Listener 陣列中, dispatch() 時更新 state 時, 會依序呼叫 listener function
    *
    * @param listener A callback to be invoked on every dispatch.
    * @returns A function to remove this change listener.
    */
   function subscribe(listener: () => void) {
      if (typeof listener !== "function") {
         throw new Error("Expected the listener to be a function.");
      }

      if (isDispatching) {
         throw new Error(
            "You may not call store.subscribe() while the reducer is executing. " +
               "If you would like to be notified after the store has been updated, subscribe from a " +
               "component and invoke store.getState() in the callback to access the latest state. " +
               "See https://redux.js.org/api/store#subscribelistener for more details."
         );
      }

      let isSubscribed = true;

      nextListeners.push(listener);

      return function unsubscribe() {
         if (!isSubscribed) {
            return;
         }

         if (isDispatching) {
            throw new Error(
               "You may not unsubscribe from a store listener while the reducer is executing. " +
                  "See https://redux.js.org/api/store#subscribelistener for more details."
            );
         }

         isSubscribed = false;

         const index = nextListeners.indexOf(listener);
         nextListeners.splice(index, 1);
      };
   }

   /**
    * dispatch 接收一個 action obj , 並用 action.type 來讓 reducers 計算出新的 state, 取得 新的 state 後依序呼叫 Listeners function
    *
    * @param action A plain object representing “what changed”. It is
    * a good idea to keep actions serializable so you can record and replay user
    * sessions, or use the time travelling `redux-devtools`. An action must have
    * a `type` property which may not be `undefined`. It is a good idea to use
    * string constants for action types.
    *
    * @returns For convenience, the same action object you dispatched.
    *
    */
   function dispatch(action: A) {
      if (!isPlainObject(action)) {
         throw new Error(
            "Actions must be plain objects. " + "Use custom middleware for async actions."
         );
      }

      if (typeof action.type === "undefined") {
         throw new Error(
            'Actions may not have an undefined "type" property. ' +
               "Have you misspelled a constant?"
         );
      }

      if (isDispatching) {
         throw new Error("Reducers may not dispatch actions.");
      }

      try {
         isDispatching = true;
         currentState = currentReducer(currentState, action);
      } finally {
         isDispatching = false;
      }

      const listeners = nextListeners;
      for (let i = 0; i < listeners.length; i++) {
         const listener = listeners[i];
         listener();
      }

      return action;
   }

   // store 被 created 後先 dispatch 一次, 讓 state 帶入 initial state
   dispatch({ type: ActionTypes.INIT } as A);

   const store = ({
      dispatch: dispatch as Dispatch<A>,
      subscribe,
      getState,
   } as unknown) as Store<ExtendState<S, StateExt>, A, StateExt, Ext> & Ext;
   return store;
}
