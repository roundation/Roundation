import getKeys from './get-keys'

export default function protectPrivateFields (obj: object) {
  getKeys(obj).forEach(key => {
    if (key[0] === '_' && key[1] === '_') {
      Object.defineProperty(obj, key, {
        configurable: false,
        writable: false,
        enumerable: false,
      })
    }
  })
}
