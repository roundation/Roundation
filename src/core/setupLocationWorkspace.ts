import getValues from '../utils/get-values'
import compilePath from '../utils/compile-path'
import protectPrivateFields from '../utils/protect-private-fields'

import * as Roundation from '../types'

export type RouteNodeTypeName = 'layout' | 'index' | 'default' | 'slot'
export type LocationInspectCommandType = LocationInfo | '.' | '..' | '/' | undefined
export type LocationLocateCommandType = LocationInfo | '.' | '..' | '/' | undefined
export type LocationListCommandType = LocationInfo | '.' | '..' | '/' | '~' | undefined
export interface LocationCommandContext {
  inspect (this: LocationInfo, location: LocationInspectCommandType): LocationInfo | null
  locate (this: LocationInfo, location: LocationLocateCommandType, replacerObj?: object, replace?: boolean): void
  locate (this: LocationInfo, location: LocationLocateCommandType, replacerObj?: object, queryObj?: object, replace?: boolean): void
  list (this: LocationInfo, location: LocationListCommandType, showAllType?: boolean): LocationInfo[] | null
}

export type NavigateFn = (path: string, replace: boolean) => void

export class LocationInfo implements LocationCommandContext {
  'constructor': typeof LocationInfo
  static navigate: NavigateFn = () => {}

  private readonly __rootNodeAlternative: Roundation.RouteNode
  private readonly __contextNodeAlternative: Roundation.RouteNode
  private readonly __manifest: Roundation.Manifest
  private readonly __permissions: string[]
  readonly name: string
  readonly type: RouteNodeTypeName
  readonly icon: string
  readonly routePath: string
  readonly routeFullPath: string

  constructor (
    contextNode: Roundation.RouteNode,
    contextNodeType: RouteNodeTypeName,
    rootNode: Roundation.RouteNode = contextNode
  ) {
    this.__rootNodeAlternative = rootNode
    this.__contextNodeAlternative = contextNode
    this.type = contextNodeType
    this.__manifest = contextNode.manifest
    this.__permissions = contextNode.permissions
    this.name = contextNode.name
    this.icon = contextNode.icon
    this.routePath = contextNode.routePath
    this.routeFullPath = contextNode.routeFullPath
    protectPrivateFields(this)
  }

  private __inspectLocationInfo (locationInfo: LocationInfo): LocationInfo {
    return new LocationInfo(locationInfo.__contextNodeAlternative, locationInfo.type, this.__rootNodeAlternative)
  }

  private __inspectParentLocationInfo (): LocationInfo | null {
    return this.__contextNodeAlternative.parent
      ? new LocationInfo(this.__contextNodeAlternative, 'layout', this.__rootNodeAlternative)
      : null
  }

  private __inspectRootLocationInfo (): LocationInfo {
    return new LocationInfo(this.__rootNodeAlternative, 'layout')
  }

  private __navigate (replacerObj: object, queryObj: object, replace: boolean) {
    return this.constructor.navigate(compilePath(this.routeFullPath, replacerObj), replace)
  }

  private __listChildrenLocationInfo (showAllType: boolean): LocationInfo[] {
    const childrenInfos = this.__contextNodeAlternative.children
      .filter(routeNode => !routeNode.isConcatenated)
      .sort((prev, curr) => prev.index - curr.index)
      .map(routeNode => new LocationInfo(routeNode, 'layout', this.__rootNodeAlternative))

    if (!showAllType) return childrenInfos

    const indexInfos = this.__contextNodeAlternative.Index
      ? [new LocationInfo(this.__contextNodeAlternative, 'index', this.__rootNodeAlternative)]
      : []

    const defaultInfos = this.__contextNodeAlternative.Default
      ? [new LocationInfo(this.__contextNodeAlternative, 'default', this.__rootNodeAlternative)]
      : []

    const slotsInfos = getValues(this.__contextNodeAlternative.slots)
      .map(() => new LocationInfo(this.__contextNodeAlternative, 'slot', this.__rootNodeAlternative))

    return [...indexInfos, ...childrenInfos, ...defaultInfos, ...slotsInfos]
  }

  private __getBreadCrumbsInfo (
    breadCrumbs: LocationInfo[],
  ): LocationInfo[] {
    if (!breadCrumbs[0]) return breadCrumbs.slice(1)

    return [
      this.__inspectParentLocationInfo()!,
      ...breadCrumbs,
    ]
  }

  getPermissions (): string[] {
    return [...this.__permissions]
  }

  getManifest (): Roundation.Manifest | {} {
    try {
      return JSON.parse(JSON.stringify(this.__manifest)) as Roundation.Manifest
    } catch {
      return {}
    }
  }

  inspect (location?: LocationInspectCommandType): LocationInfo | null {
    if (!location) return this
    if (typeof location !== 'string') return this.__inspectLocationInfo(location)

    switch (location) {
      case '.':
        return this
      case '..':
        return this.__inspectParentLocationInfo()
      case '/':
        return this.__inspectRootLocationInfo()
      default: {
        throw new Error('Invalid inspect location!')
      }
    }
  }

  locate (location?: LocationLocateCommandType, replacerObj: object = {}, replaceOrQueryObj?: boolean | object, maybeReplace?: boolean): void {
    const queryObj = typeof replaceOrQueryObj === 'object' ? replaceOrQueryObj : {}
    const replace = typeof replaceOrQueryObj === 'boolean' ? replaceOrQueryObj : (maybeReplace || false)

    if (!location) return this.__navigate(replacerObj, queryObj, replace)
    if (typeof location !== 'string') {
      return this. __inspectLocationInfo(location).__navigate(replacerObj, queryObj, replace)
    }

    switch (location) {
      case '.':
        return this.__navigate(replacerObj, queryObj, replace)
      case '..':{
        const parentLocation = this.__inspectParentLocationInfo()
        return parentLocation
          ? parentLocation.__navigate(replacerObj, queryObj, replace)
          : undefined
      }
      case '/':
        return this.__inspectRootLocationInfo().__navigate(replacerObj, queryObj, replace)
      default: {
        throw new Error('Invalid locate location!')
      }
    }
  }

  list (location?: LocationListCommandType, showAllType: boolean = false): LocationInfo[] {
    if (!location) return this.__listChildrenLocationInfo(showAllType)
    if (typeof location !== 'string') {
      return this. __inspectLocationInfo(location).__listChildrenLocationInfo(showAllType)
    }

    switch (location) {
      case '.':
        return this.__listChildrenLocationInfo(showAllType)
      case '..': {
        const parentLocation = this.__inspectParentLocationInfo()
        return parentLocation ? parentLocation.__listChildrenLocationInfo(showAllType) : []
      }
      case '/':
        return this.__inspectRootLocationInfo().__listChildrenLocationInfo(showAllType)
      case '~':
        return this.__getBreadCrumbsInfo([this])
      default: {
        throw new Error('Invalid list location!')
      }
    }
  }
}

export default function setupLocationWorkspace (
  rootRouteNode: Roundation.RouteNode,
  navigate: NavigateFn,
) {
  LocationInfo.navigate = navigate

  return function setupCommandContext (contextNode: Roundation.RouteNode) {
    return function getLocationInfo (contextNodeType: RouteNodeTypeName) {
      return new LocationInfo(contextNode, contextNodeType, rootRouteNode)
    }
  }
}
