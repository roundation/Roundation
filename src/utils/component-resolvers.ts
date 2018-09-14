import * as Loadable from 'react-loadable'
import * as Roundation from '../types'

export function asyncComponentResolve (filePath: string) {
  return Loadable<Roundation.ComponentProps, any>({
    loader: () => import('~src/pages' + filePath),
    loading: () => null,
  })
}

export function syncComponentResolve (filePath: string) {
  const syncModule = require('~src/pages' + filePath)

  return (syncModule.default || syncModule) as React.ComponentClass<Roundation.ComponentProps, any>
}

export function asyncMarkdownComponentResolve () {
  return null
}

export function syncMarkdownComponentResolve () {
  return null
}
