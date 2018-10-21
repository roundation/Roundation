import { RouteComponentProps } from '@reach/router'
import { LocationInfo } from './core/setupLocationWorkspace'

export { LocationInfo }

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

export { RouteComponentProps }
export interface ComponentProps extends RouteComponentProps {
  locationInfo: LocationInfo
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
  index: number,
  isConcatenated: boolean
  children: RouteNode[]
  Layout: ComponentClass
  Index?: ComponentClass
  Default?: ComponentClass
  slots: ComponentResolvedCollection
}

export interface RouteInfoMap {
  [n: string]: RouteInfo
}
