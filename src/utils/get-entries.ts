export default function getEntries<T> (o: { [s: string]: T } | ArrayLike<T>): Array<[string, T]> {
  const entries: Array<[string, T]> = []
  for (const i in o) {
    if (!o.hasOwnProperty || o.hasOwnProperty(i)) entries.push([i, o[i]])
  }

  return entries
}
