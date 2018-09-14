import { navigate } from '@reach/router'
import getValues from './utils/get-values'
import * as Roundation from './types'

export function createNodeProto (routeNode: Roundation.RouteNode) {
  return Object.defineProperty({}, '__node', {
    configurable: false,
    writable: false,
    enumerable: false,
    value: routeNode,
  })
}

export function getLocationInfo (type: 'layout')
  : (routeNode: Roundation.RouteNode) => Roundation.LayoutLocationInfo
export function getLocationInfo (type: Exclude<Roundation.ComponentType, 'layout'>)
  : (routeNode: Roundation.RouteNode) => Roundation.OtherLocationInfo
export function getLocationInfo (type: Roundation.ComponentType) {
  return type === 'layout'
    ? function getLayoutLocationInfo (routeNode: Roundation.RouteNode): Roundation.LayoutLocationInfo {
      return Object.assign(
        createNodeProto(routeNode),
        {
          type,
          name: routeNode.name,
          icon: routeNode.icon,
          permissions: routeNode.permissions,
          manifest: routeNode.manifest,
          routePath: routeNode.routePath,
          routeFullPath: routeNode.routeFullPath,
          navigate: () => {
            navigate(routeNode.routeFullPath)
          },
        },
      )
    }
    : function getLayoutLocationInfo (routeNode: Roundation.RouteNode): Roundation.OtherLocationInfo {
      return Object.assign(
        createNodeProto(routeNode),
        {
          type,
          name: routeNode.name,
        },
      )
    }
}

export function listChildren (routeNode: Roundation.RouteNode) {
  const slotInfos = getValues(routeNode.slots).map(() => getLocationInfo('slot')(routeNode))

  return [
    routeNode.Index && getLocationInfo('index')(routeNode),
    ...routeNode.children.map(getLocationInfo('layout')),
    routeNode.Default && getLocationInfo('default')(routeNode),
    ...slotInfos,
  ]
    .filter((exist => !!exist)) as Roundation.LocationInfo[]
}

export function listSelf (
  routeNode: Roundation.RouteNode,
  type: Roundation.ComponentType,
): Roundation.LayoutLocationInfo[] | Roundation.OtherLocationInfo[] {
  return [getLocationInfo(type as any)(routeNode)]
}

export function listChildrenByLocationInfo (location: Roundation.LocationInfo): Roundation.LocationInfo[] {
  return listChildren((location as any).__node as Roundation.RouteNode)
}

export function lookupToRoot (
  breadCrumbs: Roundation.LocationInfo[],
  routeNode: Roundation.RouteNode,
): Roundation.LocationInfo[] {
  const parentNode = routeNode.parent
  if (!parentNode)  return breadCrumbs

  return (listSelf(parentNode, 'layout') as Roundation.LocationInfo[]).concat(breadCrumbs)
}

export default function setupCommandWorkspace (rootRouteNode: Roundation.RouteNode) {
  return function setCommandContext (contextNode: Roundation.RouteNode) {
    return function makeCommands (contextNodeType: Roundation.ComponentType) {
      const commands = {
        list,
        locate,
      }

      function list (location?: Roundation.LocationListCommandType): Roundation.LocationInfo[] {
        if (!location) return listSelf(contextNode, contextNodeType)
        if (typeof location !== 'string') return listChildrenByLocationInfo(location)

        switch (location) {
          case '-':   // alias to undefined location
            return listSelf(contextNode, contextNodeType)
          case '.':
            return listChildren(contextNode)
          case '..':
            return contextNode.parent ? listChildren(contextNode.parent) : []
          case '/':   // list root route node
            return listChildren(rootRouteNode)
          case '~':   // bread crumbs
            return lookupToRoot(listSelf(contextNode, contextNodeType), contextNode)
          default: {
            return []
          }
        }
      }

      function locate (location?: Roundation.LocationLocateCommandType): Roundation.LocationCommandContext {
        if (!location) return commands
        if (typeof location !== 'string') {
          return setCommandContext((location as any).__node as Roundation.RouteNode)(location.type)
        }

        switch (location) {
          case '..':
            return contextNode.parent ? setCommandContext(contextNode.parent)('layout') : commands
          case '/':   // list root route node
            return setCommandContext(rootRouteNode)('layout')
          default: {
            return commands
          }
        }
      }

      return commands
    }
  }
}
