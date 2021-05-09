import getEntries from './get-entries'

function objectMap<O extends ArrayLike<T>, T, U> (o: O, fn: (i: T) => U): ArrayLike<U>
function objectMap<O, T extends O[keyof O], U> (o: O, fn: (i: T) => U): { [s in keyof O]: U }
function objectMap<O extends ArrayLike<T>, T extends O[keyof O], U> (o: O, fn: (i: T) => U)
  : ArrayLike<U> | { [s in keyof O]: U } {
  return getEntries(o).reduce(
    (acc, [key, value]) => {
      if (key === 'length') {
        acc.length = value

        return acc
      }

      acc[key] = fn(value)

      return acc
    },
    Object.create(null),
  )
}

export default objectMap
