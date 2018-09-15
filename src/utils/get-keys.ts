export default function getKeys (o: { [s: string]: any } | ArrayLike<any>): string[] {
  const keys: string[] = []
  for (const i in o) {
    if (!o.hasOwnProperty || o.hasOwnProperty(i)) keys.push(i)
  }

  return keys
}
