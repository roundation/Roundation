import pathResolveChunks from './utils/path-resolve-chunks'
import {
  asyncComponentResolve,
  syncComponentResolve,
} from './utils/component-resolvers'
import * as Roundation from '~src/lib/roundation/types'

const buildRouteInfoMap = () => {
  // context '~src/pages' must be static computable
  const fileContext = require.context('~src/pages', true)

  const routeInfoMap: Roundation.RouteInfoMap = fileContext.keys().reduce(
    (map, contextKey) => {
      // could resolve to chunks
      const pathResolver = pathResolveChunks('~src/pages', contextKey)
      // e.g.: [contextFolder, contextFolder2, ..., contextFolderN, contextFilename]
      const pathChunks = pathResolver.toPathChunks()
      // e.g.: ['/', contextFolder, contextFolder2, ..., contextFolderN]
      const routePaths = ['/', ...pathChunks.slice(0, -1)]
      // context path: '/folder/folder2/filename.extension'
      const filePath = '/' + pathChunks.join('/')
      // directory path: '/folder/folder2'
      const directoryPath = '/' + pathChunks.slice(0, -1).join('/')
      // file extension: '.json', file name may contain '.'
      const fileFullName = pathChunks.slice(-1)[0]
      const [fileExtension, ...fileNameParts] = fileFullName.split('.').reverse()
      const fileName = fileNameParts.reverse().join('.')
      // default name is same as the last folder name, or 'RoundationRouterEntry' to root folder
      const [folderName] = pathChunks.length > 1 ? pathChunks.slice(-2) : ['Roundation Root']
      const defaultName = folderName.replace(/^\^/, '')
      const defaultIcon = ''
      const defaultPermissions: string[] = []
      // root route has key '/'
      const routeKey = directoryPath || '/'

      const routeInfo: Roundation.RouteInfo = map[routeKey] = map[routeKey] || {
        name: defaultName,
        icon: defaultIcon,
        permissions: defaultPermissions,
        directoryPath,
        routePaths,
        manifest: {
          name: defaultName,
          icon: defaultIcon,
          permissions: defaultPermissions,
        },
        resolveToLayout: undefined!,
        resolveToIndexRoute: undefined,
        resolveToDefaultRoute: undefined,
        slots: {},
        children: [] as Roundation.RouteInfo[],
        siblings: [] as Roundation.RouteInfo[],
      // tslint:disable-next-line:no-object-literal-type-assertion
      } as Roundation.RouteInfo

      if (/^(j|t)sx?$/.test(fileExtension)) {
        switch (fileName.toLowerCase()) {
          case 'layout':
            routeInfo.resolveToLayout = () => asyncComponentResolve(filePath)
            break
          case '^layout': {
            routeInfo.resolveToLayout = () => syncComponentResolve(filePath)
            break
          }
          case 'index': {
            routeInfo.resolveToIndexRoute = () => asyncComponentResolve(filePath)
            break
          }
          case '^index': {
            routeInfo.resolveToIndexRoute = () => syncComponentResolve(filePath)
            break
          }
          case 'default': {
            routeInfo.resolveToDefaultRoute = () => asyncComponentResolve(filePath)
            break
          }
          case '^default': {
            routeInfo.resolveToDefaultRoute = () => syncComponentResolve(filePath)
            break
          }
          default: {
            if (fileName[0] === '^') {
              routeInfo.slots[fileName.slice(1)] = () => syncComponentResolve(filePath)
            } else {
              routeInfo.slots[fileName] = () => asyncComponentResolve(filePath)
            }
          }
        }
      }

      if (fileFullName === 'manifest.json') {
        const declaredManifest = fileContext(contextKey) as Roundation.DeclaredManifest || {}
        const {
          name = defaultName, icon = defaultIcon, permissions = defaultPermissions,
        } = declaredManifest
        routeInfo.name = name
        routeInfo.icon = icon
        routeInfo.permissions = permissions
        routeInfo.manifest = { ...declaredManifest, name, icon, permissions }
      }

      return map
    },
    Object.create(null) as Roundation.RouteInfoMap,
  )

  return routeInfoMap
}

export default buildRouteInfoMap
