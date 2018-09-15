import arrayEqual from '../utils/array-equal'
import getValues from '../utils/get-values'

import * as Roundation from '../types'

const buildRouteInfoTree = (routeInfoMap: Roundation.RouteInfoMap) => {
  const routeInfos = getValues(routeInfoMap)

  routeInfos.forEach(routeInfo => {
    if (!routeInfo.resolveToLayout) {
      throw new Error(`Missing Layout Component under path: '${routeInfo.directoryPath}'`)
    }

    const parentRoute = routeInfos.find(
      routeInfo2 => arrayEqual(routeInfo2.routePaths, routeInfo.routePaths.slice(0, -1)),
    )
    if (!parentRoute) return

    if (routeInfo.routePaths.slice(-1)[0][0] === '@') {
      parentRoute.siblings.push(routeInfo)
    }

    parentRoute.children.push(routeInfo)
  })

  const root = routeInfos.find(routeInfo => routeInfo.routePaths.length === 1)

  if (!root) throw new Error('Missing root Layout')

  // root component has no siblings
  if (root.siblings.length) {
    root.children.push(...root.siblings)
    root.siblings = []
  }

  return root
}

export default buildRouteInfoTree
