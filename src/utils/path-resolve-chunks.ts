export function splitChunks (path: string, safe: boolean = true) {
  const chunks = (path[0] === '/' ? ['/'] : []).concat(path.split('/'))

  return chunks.reduce(
    (cleaned, chunk) => {
      if (chunk === '' || chunk === '.') return cleaned

      if (chunk === '..' && cleaned.length) return cleaned.slice(0, -1)

      if (chunk === '..' && safe)  throw new Error('Invalid path')

      return cleaned.concat(chunk)
    },
    [] as string[],
  )
}

export default function pathResolveChunks (base: string, path: string) {
  return {
    toChunks () {
      return splitChunks(`${base}/${path}`)
    },
    toBaseChunks () {
      return splitChunks(base)
    },
    toPathChunks () {
      return splitChunks(path)
    },
  }
}
