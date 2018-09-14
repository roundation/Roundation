export default function getValues<T> (o: { [s: string]: T } | ArrayLike<T>): T[] {
  const values: T[] = []
  for (const i in o) {
    if (!o.hasOwnProperty || o.hasOwnProperty(i)) values.push(o[i])
  }

  return values
}
