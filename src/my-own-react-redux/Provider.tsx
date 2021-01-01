import React, { FC } from "react";
import { Store } from "../types/store";
import Context from "./Context";

interface ProviderProps {
   store: Store;
}

const Provider: FC<ProviderProps> = ({ store, children }) => {
   return <Context.Provider value={{ store }}>{children}</Context.Provider>;
};

export default Provider;
