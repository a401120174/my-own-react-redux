import { useContext } from "react";
import ReactReduxContext from "./Context";

export function useReduxContext() {
   const contextValue = useContext(ReactReduxContext);

   if (!contextValue) {
      throw new Error(
         "could not find react-redux context value; please ensure the component is wrapped in a <Provider>"
      );
   }

   return contextValue;
}
