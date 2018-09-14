import * as Loadable from 'react-loadable'
import { RouteComponentProps } from '@reach/router'

declare namespace Roundation {
  export interface Manifest {
    name: string
    icon: string
    permissions: string[]
  }

  export interface DeclaredManifest extends Partial<Manifest> {
    [field: string]: any
  }

  export interface RouteBaseInfo {
    name: string
    icon: string
    permissions: string[]
    manifest: Manifest
  }

  export type ComponentType = 'layout' | 'index' | 'default' | 'slot'

  export interface LayoutLocationInfo extends RouteBaseInfo {
    type: 'layout'
    routePath: string
    routeFullPath: string
    navigate: () => void
  }

  export interface OtherLocationInfo {
    type: 'index' | 'default' | 'slot'
    name: string
  }

  export type LocationInfo = LayoutLocationInfo | OtherLocationInfo

  export type LocationListCommandType = Roundation.LocationInfo | '.' | '..' | '/' | '-' | '~'
  export type LocationLocateCommandType = Roundation.LocationInfo | '..' | '/'
  export interface LocationCommandContext {
    list: (location?: LocationListCommandType) => LocationInfo[]
    locate:  (location?: LocationLocateCommandType) => LocationCommandContext
  }

  export interface ComponentProps extends RouteComponentProps {
    commands: LocationCommandContext
  }

  export type ComponentClass = React.ComponentClass<ComponentProps, any> | React.StatelessComponent<ComponentProps> & LoadableExport.LoadableComponent

  export interface ComponentResolveThunkCollection {
    [key: string]: () => ComponentClass
  }

  export interface RouteInfo extends RouteBaseInfo {
    routePaths: string[]
    directoryPath: string
    resolveToLayout: () => ComponentClass
    resolveToIndexRoute?: () => ComponentClass
    resolveToDefaultRoute?: () => ComponentClass
    slots: ComponentResolveThunkCollection
    children: RouteInfo[]
    siblings: RouteInfo[]
  }

  export interface ComponentResolvedCollection {
    [key: string]: ComponentClass
  }

  export interface RouteNode extends RouteBaseInfo {
    parent: RouteNode | null
    routePath: string
    routeFullPath: string
    children: RouteNode[]
    Layout: ComponentClass
    Index?: ComponentClass
    Default?: ComponentClass
    slots: ComponentResolvedCollection
  }

  export interface RouteInfoMap {
    [n: string]: RouteInfo
  }
}

export = Roundation
