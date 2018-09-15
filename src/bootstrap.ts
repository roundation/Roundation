import buildRouteInfoTree from './core/buildRouteInfoTree'
import buildRouteInfoMap from './core/buildRouteInfoMap'
import buildRouteNodeTree from './core/buildRouteNodeTree'

export default function bootstrap () {
  const routeInfoMap = buildRouteInfoMap()
  const routeInfoTree = buildRouteInfoTree(routeInfoMap)
  const routeNodeTree = buildRouteNodeTree(routeInfoTree)

  return routeNodeTree
}
