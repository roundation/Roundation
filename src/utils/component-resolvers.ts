import * as Loadable from 'react-loadable'
import * as Roundation from '../types'

export function asyncComponentResolve (filePath: string)
  : React.ComponentType<Roundation.ComponentProps> & Loadable.LoadableComponent {
  return Loadable<Roundation.ComponentProps, any>({
    loader: () => import('~src/pages' + filePath),
    loading: () => null,
  })
}

export function syncComponentResolve (filePath: string)
  : React.ComponentType<Roundation.ComponentProps> {
  const syncModule = require('~src/pages' + filePath)

  return (syncModule.default || syncModule) as React.ComponentType<Roundation.ComponentProps>
}

export function asyncMarkdownComponentResolve () {
  return null
}

export function syncMarkdownComponentResolve () {
  return null
}
