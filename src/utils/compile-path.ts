import getEntries from './get-entries'
import { stringify } from 'query-string'

export default function compilePath (path: string, params: {}, queries: object = {}): string {
  return `${getEntries(params).reduce(
    (parsingPath, [key, value]) => {
      const keyReg = new RegExp(`/(:${key})(/|$)`)

      let parsedPath = parsingPath

      do {
        parsingPath = parsedPath
        parsedPath = parsingPath.replace(keyReg, `/${value}$2`)
      } while (parsedPath !== parsingPath)

      return parsedPath
    },
    path,
  )}?${stringify(queries)}`
}

export const compilePathWithQueries = (path: string, queries: object) => `${path}?${stringify(queries)}`
