import { Flatten, GenericInquiry, KeyedInquiry, TypeOne, TypeThree, TypeTwo } from "./reusable-types";
import { noop } from "./utils";

// Example baseline, avoid inheritance
// POC
type AllowedType = {
  X: Flatten<GenericInquiry & { 'waffles': string }>,
  Y: Flatten<GenericInquiry & { 'derp': string }>
}
// ref type decomposition in arg generics
function useTypes<TKey extends keyof AllowedType, TValue extends AllowedType[TKey]>(arg: TKey, payload: TValue): void {
  noop();
}

// example usage, ctrl-+ for suggested values per key
useTypes('Y', {})

// Approach 1: Record Merging ( with manual Record type )
type KeyByType<T extends { type: string }> = { [K in T['type']]: T }

type AllowedInquiryTypes = Flatten<
  KeyByType<TypeOne>
  & KeyByType<TypeTwo>
  & KeyByType<TypeThree>
>

function manualMergeTest<TKey extends keyof AllowedInquiryTypes, TValue extends AllowedInquiryTypes[TKey]>(arg: TKey, payload: TValue): void {
  noop();
}

manualMergeTest('one', {});

// Approach 2: Tuple mapping
type MapTupleToObject<T extends readonly { type: string }[]> = {
  [K in keyof { [Kk in T[number]['type']]: T[number] }]: Extract<T[number], { type: K }>
}

type AllowedTupleTypes = MapTupleToObject<[
  TypeOne, TypeTwo, TypeThree
]>

function tupleTest<TKey extends keyof AllowedTupleTypes>(
  arg: TKey, payload: AllowedTupleTypes[TKey]
): void {
  noop();
}

// example, use ctrl+space to see the variation by arg
tupleTest('one', {});

// Approach 3: Union Type disjunction
/**
 * { type: union[key] } ->
 *    { key: union[{ type: key }] } ->
 *        { key: { type: key } }}
  */

type MapTypeToObject<T extends { type: string }> = {
  [K in keyof Record<T['type'], T>]: Extract<T, { type: K }>
};

// types
type AllowedTypes = MapTypeToObject<TypeOne | TypeTwo | TypeThree>

// example object matching contract
const examplePayload: TypeOne = {
  fieldA: 'wee',
  fieldB: 'woo',
  fieldC: 'waahaaa',
  type: 'one',
  garbage: false,
  moreStuff: 'weee'
};

// exmaple using keyspace
function unionDisjunctionTest<TKey extends keyof AllowedTypes, TValue extends AllowedTypes[TKey]>(
  arg: TKey, payload: TValue
): void {
  noop();
}

unionDisjunctionTest('one', examplePayload);

