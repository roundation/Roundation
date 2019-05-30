import getKeys from './get-keys'

type StripNullable<O extends object> = {
  [k in keyof O]-?: O[k]
}

function cleanObject<O extends object> (o: O): StripNullable<O> {
  const copy = { ...o }
  getKeys(copy).forEach(key => {
    if (copy[key] === null || copy[key] === undefined) {
      delete copy[key]
    }
  });
  return copy as any
}

export default cleanObject
