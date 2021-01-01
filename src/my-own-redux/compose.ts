type Func<T extends any[], R> = (...a: T) => R;

/**
 * 新建一個新數組funcs，將arguments裡面的每一項一一拷貝到funcs中去
 * 當funcs的長度為0時，返回一個傳入什麼就返回什麼的函數
 * 當funcs的長度為1時，返回funcs第0項對應的函數
 * 當funcs的長度大於1時，調用Array.prototype.reduce方法進行整合
 *
 * @param funcs The functions to compose.
 * @returns A function obtained by composing the argument functions from right
 *   to left. For example, `compose(f, g, h)` is identical to doing
 *   `(...args) => f(g(h(...args)))`.
 */
export default function compose(): <R>(a: R) => R;

export default function compose<F extends Function>(f: F): F;

/* two functions */
export default function compose<A, T extends any[], R>(
   f1: (a: A) => R,
   f2: Func<T, A>
): Func<T, R>;

/* three functions */
export default function compose<A, B, T extends any[], R>(
   f1: (b: B) => R,
   f2: (a: A) => B,
   f3: Func<T, A>
): Func<T, R>;

/* four functions */
export default function compose<A, B, C, T extends any[], R>(
   f1: (c: C) => R,
   f2: (b: B) => C,
   f3: (a: A) => B,
   f4: Func<T, A>
): Func<T, R>;

/* rest */
export default function compose<R>(
   f1: (a: any) => R,
   ...funcs: Function[]
): (...args: any[]) => R;

export default function compose<R>(...funcs: Function[]): (...args: any[]) => R;

export default function compose(...funcs: Function[]) {
   if (funcs.length === 0) {
      // infer the argument type so it is usable in inference down the line
      return <T>(arg: T) => arg;
   }

   if (funcs.length === 1) {
      return funcs[0];
   }

   return funcs.reduce((a, b) => (...args: any) => a(b(...args)));
}
