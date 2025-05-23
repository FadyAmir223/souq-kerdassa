export function areEqualShallow<T>(a: T, b: T) {
  for (const key in a) if (a[key] !== b[key]) return false
  return true
}
