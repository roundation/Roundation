import flatMap from '../utils/flat-map'
import findLastIndex from '../utils/find-last-index'
import objectMap from '../utils/object-map'
import * as Roundation from '../types.d'

export interface Node {
  children: this[],
  siblings: this[],
}

export const getSiblings = <N extends Node>(node: N): N[] =>
  node.siblings.length
    ? node.siblings
        .concat(flatMap(node.siblings, getSiblings))
    : []

export const getChildren = <N extends Node>(node: N): N[] =>
  node.children.concat(flatMap(node.children, getSiblings))

export const getRoutePath = (routePaths: string[]) => {
  const lastIndexOfNonConcatenatedRoutePath = findLastIndex(routePaths, (p: string) => !/^@/.test(p))

  return routePaths.slice(lastIndexOfNonConcatenatedRoutePath).map(p => p.replace(/^@/, '/')).join('')
}

export const buildRouteNodeTree =
  (parentNode: Roundation.RouteNode | null = null) =>
  (routeInfo: Roundation.RouteInfo): Roundation.RouteNode => {
    const routePath = getRoutePath(routeInfo.routePaths)

    const routeNode: Roundation.RouteNode = {
      parent: parentNode,
      name: routeInfo.name,
      icon: routeInfo.icon,
      permissions: routeInfo.permissions,
      routePath,
      routeFullPath: parentNode
        ? `${parentNode.routeFullPath}/${routePath}`.replace(/^\/+/, '/')
        : routePath,
      manifest: routeInfo.manifest,
      Layout: routeInfo.resolveToLayout(),
      Index: routeInfo.resolveToIndexRoute ? routeInfo.resolveToIndexRoute() : undefined,
      Default: routeInfo.resolveToDefaultRoute ? routeInfo.resolveToDefaultRoute()  : undefined,
      children: [], // will be filled
      slots: objectMap(routeInfo.slots, componentThunk => componentThunk()),
    }

    routeNode.children = getChildren(routeInfo).map(buildRouteNodeTree(routeNode))

    return routeNode
  }

export default buildRouteNodeTree()
