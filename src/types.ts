import { RouteComponentProps } from '@reach/router'
import { LocationInfo } from './core/setupLocationWorkspace'
import loadable from '@react-loadable/revised'

export type LoadableComponent = ReturnType<typeof loadable>

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
  & LoadableComponent

export type ComponentTypeWithoutSlots<S extends string = never> = (
  | React.ComponentType<Omit<ComponentProps<S>, 'slots'>>
  | React.ComponentType<Omit<ComponentProps, 'slots'>>
)
  & LoadableComponent

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
