export default function arrayEqual (arr1: unknown[], arr2: unknown[]) {
  return arr1.length === arr2.length && arr1.every((str, index) => str === arr2[index])
}
