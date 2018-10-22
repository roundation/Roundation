import getEntries from './get-entries'

function objectMap<T, U> (o: ArrayLike<T>, fn: (i: T) => U): ArrayLike<U>
function objectMap<T, U> (o: { [s: string]: T }, fn: (i: T) => U): { [s: string]: U }
function objectMap<T, U> (o: { [s: string]: T } | ArrayLike<T>, fn: (i: T) => U): { [s: string]: U } | ArrayLike<U> {
  return getEntries(o).reduce(
    (acc, [key, value]) => {
      if (key === 'length') {
        acc['length'] = value

        return acc
      }

      acc[key] = fn(value)

      return acc
    },
    o.hasOwnProperty ? {} : Object.create(null),
  )
}

export default objectMap
