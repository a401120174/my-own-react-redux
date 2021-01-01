import React from "react";
import { useSelector } from "../my-own-react-redux/useSelector";
import { useDispatch } from "../my-own-react-redux/useDispatch";

interface CountState {
   count: number;
}

const Counter: React.FC = () => {
   console.log("re-render");
   const dispatch = useDispatch();
   const count = useSelector<CountState, number>((state: CountState) => state.count);
   const handleAPlus = () => {
      dispatch({ type: "INCREASE" });
   };

   return (
      <div>
         <span>A: {count}</span>
         <button onClick={handleAPlus}>A++</button>
      </div>
   );
};

export default Counter;
