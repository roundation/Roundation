import getKeys from './get-keys'

function cleanObject<O extends object> (o: O): object {
  const copy = { ...o }
  getKeys(copy).forEach(key => {
    if (copy[key] === null || copy[key] === undefined || copy[key] === '') {
      delete copy[key]
    }
  });
  return copy
}

export default cleanObject
