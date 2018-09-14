import buildRouteInfoTree from './buildRouteInfoTree'
import buildRouteInfoMap from './buildRouteInfoMap'
import buildRouteNodeTree from './buildRouteNodeTree'

export default function bootstrap () {
  const routeInfoMap = buildRouteInfoMap()
  const routeInfoTree = buildRouteInfoTree(routeInfoMap)
  const routeNodeTree = buildRouteNodeTree(routeInfoTree)

  return routeNodeTree
}
