import React from "react";
import { Store } from "../types/store";

interface ContextType {
   store: Store;
}
const Context = React.createContext<ContextType | null>(null);

export default Context;
