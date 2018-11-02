import getKeys from './get-keys'

function objectIsEmpty<O extends object> (o: O): boolean {
  return getKeys(o).length === 0
}

export default objectIsEmpty
