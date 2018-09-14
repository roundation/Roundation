import getEntries from './get-entries'

export default function objectMap<T, U> (o: { [s: string]: T } | ArrayLike<T>, fn: (i: T) => U) {
  return getEntries(o).reduce(
    (acc, [key, value]) => {
      acc[key] = fn(value)

      return acc
    },
    o.hasOwnProperty ? {} : Object.create(null),
  )
}
