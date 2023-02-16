export type GenericInquiry = {
    fieldA: string;
    fieldB: string;
    fieldC: string
}

export type Flatten<T extends {}> = { [key in keyof T]: T[key] } & {}

// Data compositor
export type KeyedInquiry<TKey extends string, TExtraData extends {}> =
Flatten<GenericInquiry & { type: TKey; } & TExtraData>

// Test Data
export type TypeOne = KeyedInquiry<'one', { moreStuff: string, garbage: boolean }>;
export type TypeTwo = KeyedInquiry<'two', { specificValue: string }>;
export type TypeThree = KeyedInquiry<'three', { specificValue: string }>;