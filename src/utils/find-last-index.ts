export default function findLastIndex <T> (arr: T[], fn: (i: T) => boolean): number {
  const len = arr.length
  for (let i = len - 1; i >= 0; i--) {
    if (fn(arr[i])) return i
  }

  return -1
}
