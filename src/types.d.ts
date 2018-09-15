import * as Loadable from 'react-loadable'
import { RouteComponentProps } from '@reach/router'
import { LocationInfo } from './core/setupLocationWorkspace'

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

  export type ComponentProps<T> = RouteComponentProps<T> & {
    locationInfo: LocationInfo
  }

  export type ComponentClass = React.ComponentClass<ComponentProps<any>, any> | React.StatelessComponent<ComponentProps<any>> & LoadableExport.LoadableComponent

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
