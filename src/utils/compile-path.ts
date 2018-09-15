import getEntries from './get-entries'

export default function compilePath (path: string, params: {}): string {
  return getEntries(params).reduce(
    (parsingPath, [key, value]) => {
      const keyReg = new RegExp(`/(:${key})(/|$)`)
      let parsedPath = parsingPath
      do {
        parsingPath = parsedPath
        parsedPath = parsingPath.replace(keyReg, `/${value}$2`)
      } while (parsedPath !== parsingPath)

      return parsedPath
    },
    path
  )
}
