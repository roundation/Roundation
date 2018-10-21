import flatMap from '../utils/flat-map'
import findLastIndex from '../utils/find-last-index'
import objectMap from '../utils/object-map'

import { concatenationRegexp, indexRegexp } from '../misc/conventions'
import * as Roundation from '../types'

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

export const getLastIndexOfNonConcatenatedRoutePath = (routePaths: string[]): number =>
  findLastIndex(
    routePaths,
    (p: string) => !concatenationRegexp.test(p),
  )

export const getRoutePath = (routePaths: string[]): string =>
  routePaths.map(
    path => path.replace(concatenationRegexp, '/').replace(indexRegexp, ''),
  ).join('')

export const buildRouteNodeTree =
  (parentNode: Roundation.RouteNode | null = null) =>
  (routeInfo: Roundation.RouteInfo, index: number = 0): Roundation.RouteNode => {
    const lastIndexOfNonConcatenatedRoutePath = getLastIndexOfNonConcatenatedRoutePath(routeInfo.routePaths)
    const toBeConcatenatedRoutePaths = routeInfo.routePaths.slice(lastIndexOfNonConcatenatedRoutePath)
    const routePath = getRoutePath(toBeConcatenatedRoutePaths)
    const routeIndexSearchIndex = toBeConcatenatedRoutePaths[0].search(indexRegexp)
    const routeIndex = !~routeIndexSearchIndex
      ? index + 1
      : parseFloat('0.' + toBeConcatenatedRoutePaths[0].slice(routeIndexSearchIndex + 1))

    const routeNode: Roundation.RouteNode = {
      parent: parentNode,
      name: routeInfo.name,
      icon: routeInfo.icon,
      permissions: routeInfo.permissions,
      routePath,
      routeFullPath: parentNode
        ? `${parentNode.routeFullPath}/${routePath}`.replace(/^\/+/, '/')
        : routePath,
      index: routeIndex,
      isConcatenated: toBeConcatenatedRoutePaths.length !== 1,
      manifest: routeInfo.manifest,
      Layout: routeInfo.resolveToLayout(),
      Index: routeInfo.resolveToIndexRoute && routeInfo.resolveToIndexRoute(),
      Default: routeInfo.resolveToDefaultRoute && routeInfo.resolveToDefaultRoute(),
      children: [], // will be filled
      slots: objectMap(routeInfo.slots, componentThunk => componentThunk()),
    }

    routeNode.children = getChildren(routeInfo).map(buildRouteNodeTree(routeNode))

    return routeNode
  }

export default buildRouteNodeTree()
