import getKeys from './get-keys'

function shouldDelete (value: any): boolean {
  return value === null || value === undefined || value === ''
    || (Array.isArray(value) && value.filter(v => !shouldDelete(v)).length === 0)
}

function cleanObject<O extends object> (o: O): object {
  const copy = { ...o }
  getKeys(copy).forEach(key => {
    if (shouldDelete(copy[key])) {
      delete copy[key]
    }
  });
  return copy
}

export default cleanObject
