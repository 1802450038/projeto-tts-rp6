export const isUndefined = (key: any | null | undefined): any | null => {
  if (!key) return null

  return key
}
