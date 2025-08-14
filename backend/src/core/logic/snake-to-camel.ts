type RenameIdToUnderscoreId<T> = {
  [K in keyof T as K extends 'id' ? '_id' : K]: T[K] extends object
    ? Camelize<T[K]>
    : T[K]
}

export type Camelize<T> = RenameIdToUnderscoreId<{
  [K in keyof T as SnakeToCamelCase<string & K>]: T[K]
}>

type SnakeToCamelCase<S extends string> = S extends `${infer T}_${infer U}`
  ? `${T}${Capitalize<SnakeToCamelCase<U>>}`
  : S extends 'id'
    ? '_id'
    : S

type ConvertKeysToCamelCase<T> = T extends (infer U)[]
  ? ConvertKeysToCamelCase<U>[]
  : {
      [K in keyof T as K extends string
        ? SnakeToCamelCase<K>
        : K]: T[K] extends object ? ConvertKeysToCamelCase<T[K]> : T[K]
    }

function toCamelCase<S extends string>(str: S): SnakeToCamelCase<S> {
  return (
    str === 'id'
      ? '_id'
      : str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
  ) as SnakeToCamelCase<S>
}

export function convertSnakeToCamelCase<T>(obj: T): ConvertKeysToCamelCase<T> {
  if (Array.isArray(obj)) {
    return obj.map((item) =>
      convertSnakeToCamelCase(item)
    ) as ConvertKeysToCamelCase<T>
  }

  if (obj !== null && typeof obj === 'object') {
    const newObj: any = {}

    for (const key in obj) {
      if (Object.hasOwn(obj, key)) {
        const newKey = toCamelCase(key as string)
        newObj[newKey] = convertSnakeToCamelCase((obj as any)[key])
      }
    }
    return newObj as ConvertKeysToCamelCase<T>
  }
  return obj as ConvertKeysToCamelCase<T>
}
