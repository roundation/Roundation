export default function flatMap <T> (arr: T[], fn: (i: T) => T[]): T[] {
  return ([] as T[]).concat(...arr.map(fn))
}
