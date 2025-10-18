// export type ZeroOrOne

import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

export type OnlyOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> &
      Partial<Record<Exclude<Keys, K>, undefined>>;
  }[Keys];

// export type AtLeastOne<T> = {[K in keyof T]: Pick<T, K>}[keyof T];
export type AtLeastOne<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> &
  U[keyof U];

// TODO not tested
export type OnlyOneKey<K extends string, V = any> = {
  [P in K]: Record<P, V> & Partial<Record<Exclude<K, P>, never>> extends infer O
    ? { [Q in keyof O]: O[Q] }
    : never;
}[K];

// type ActionMap<M extends {[index: string]: any}> = {
//   [Key in keyof M]: M[Key] extends undefined
//     ? {
//         type: Key;
//       }
//     : {
//         type: Key;
//         payload: M[Key];
//       };
// };

export interface QuerySnapshot<
  T extends FirebaseFirestoreTypes.DocumentData = FirebaseFirestoreTypes.DocumentData
> extends FirebaseFirestoreTypes.QuerySnapshot<T> {
  data: T[];
}
export interface DocumentSnapshot<
  T extends FirebaseFirestoreTypes.DocumentData = FirebaseFirestoreTypes.DocumentData
> extends FirebaseFirestoreTypes.DocumentSnapshot<T> {
  doc: T;
}
// export type DocumentSnapshot<T> = FirebaseFirestoreTypes.DocumentSnapshot<T>;

// export type NavigationRoute<
//   ParamList extends ParamListBase,
//   RouteName extends keyof ParamList
// > = Route<Extract<RouteName, string>, ParamList[RouteName]> & {
//   state?: NavigationState | PartialState<NavigationState>;
// };
