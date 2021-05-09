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

export type Slots<S extends string> = { [key in S]: JSX.Element }

export type Queries<Q extends string> = Record<Q, string[] | undefined>

export type LayoutProps<Q extends string = never> = RouteComponentProps
  & { queries: Queries<Q>, setQueries: (queries: Partial<Queries<Q>>, disablePartial?: boolean) => void }
  & {
    Component: ComponentType<string> | ComponentType,
    children: React.ReactNode,
    locationInfo: LocationInfo,
    slots: ComponentResolvedCollection,
    slotsLocationInfo: LocationInfo,
  }

export type ComponentProps<S extends string = never, Q extends string = never> =
  RouteComponentProps
  & { queries: Queries<Q>, setQueries: (queries: Partial<Queries<Q>>, disablePartial?: boolean) => void }
  & ([S] extends [never] ? { locationInfo: LocationInfo } : { slots: Slots<S>, locationInfo: LocationInfo })

export type ComponentType<S extends string = never> = (
  | React.ComponentType<ComponentProps<S>>
  | React.ComponentType<ComponentProps>
)
  & LoadableExport.LoadableComponent

export interface ComponentResolveThunkCollection {
  [key: string]: () => ComponentType
}

export interface RouteInfo extends RouteBaseInfo {
  routePaths: string[]
  directoryPath: string
  resolveToLayout: () => ComponentType<string> | ComponentType
  resolveToIndexRoute?: () => ComponentType
  resolveToDefaultRoute?: () => ComponentType
  slots: ComponentResolveThunkCollection
  children: RouteInfo[]
  siblings: RouteInfo[]
}

export interface ComponentResolvedCollection {
  [key: string]: ComponentType
}

export interface RouteNode extends RouteBaseInfo {
  parent: RouteNode | null
  routePath: string
  routeFullPath: string
  index: number,
  isConcatenated: boolean
  children: RouteNode[]
  Layout: ComponentType<string> | ComponentType
  Index?: ComponentType
  Default?: ComponentType
  slots: ComponentResolvedCollection
}

export interface RouteInfoMap {
  [n: string]: RouteInfo
}
