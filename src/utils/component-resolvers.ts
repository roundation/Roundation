import loadable from '@react-loadable/revised'
import * as Roundation from '../types'

export function asyncComponentResolve (filePath: string): Roundation.ComponentType & Roundation.LoadableComponent {
  return loadable<Roundation.ComponentProps, any>({
    loader: () => import('~src/pages' + filePath),
    loading: () => null,
  })
}

export function syncComponentResolve (filePath: string): Roundation.ComponentType {
  const syncModule = require('~src/pages' + filePath)

  return (syncModule.default || syncModule)
}

export function asyncMarkdownComponentResolve () {
  return null
}

export function syncMarkdownComponentResolve () {
  return null
}
