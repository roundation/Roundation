export default function arrayEqual (arr1: any[], arr2: any[]) {
  return arr1.length === arr2.length && arr1.every((str, index) => str === arr2[index])
}
