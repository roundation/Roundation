import * as React from 'react'
import { Location, Router, RouterProps, navigate, LocationContext } from '@reach/router'
import { parse } from 'query-string'
import LayoutRoute from './LayoutRoute'
import bootstrap from '../core/bootstrap'
import { RouteNode } from '../types'
import setupLocationWorkspace, { NavigateFn } from '../core/setupLocationWorkspace'
import mapValues from '../utils/object-map'
import { compilePathWithQueries } from '../utils/compile-path'
import cleanObject from '../utils/clean-object'

export interface Props extends RouterProps {
  wrapperAttributes?: React.HTMLAttributes<HTMLDivElement>
}

const roundationNavigate: NavigateFn = (path, replace) => {
  navigate(path, { replace })
}

export default class Roundation extends React.PureComponent<Props> {
  private routeNodeTree = bootstrap()
  private setCommandContext = setupLocationWorkspace(this.routeNodeTree, roundationNavigate)

  private renderRouteComponent = (routeNode: RouteNode, location: LocationContext) => {
    const { routePath, routeFullPath, Layout, Index, Default, children, slots } = routeNode
    const getLocationInfo = this.setCommandContext(routeNode)
    const parsedQueries = parse(location.location.search)
    const queries = mapValues(
      parsedQueries,
      i => i ? ([] as string[]).concat(i) : undefined,
    )
    const setQueries = (partialQueries: object, disablePartial: boolean = false) => {
      const newQueries = disablePartial
        ? partialQueries
        : { ...queries, ...partialQueries }
      navigate(compilePathWithQueries('', cleanObject(newQueries)))
    }

    return (
      <LayoutRoute
        key={routeFullPath}
        Component={Layout}
        path={routePath}
        locationInfo={getLocationInfo('layout')}
        queries={queries}
        setQueries={setQueries}
        slots={slots}
        slotsLocationInfo={getLocationInfo('slot')}
      >
        {[
          // index route component
          Index && (
            <Index
              key="/" path="/"
              queries={queries} setQueries={setQueries}
              locationInfo={getLocationInfo('index')}
            />
          ),
          // normal route components
          ...children.map(child => this.renderRouteComponent(child, location)),
          // default route components
          Default && (
            <Default
              key="default" default
              queries={queries} setQueries={setQueries}
              locationInfo={getLocationInfo('default')}
            />
          ),
        ]
          .filter(exist => !!exist)
        }
      </LayoutRoute>
    )
  }

  render () {
    const { wrapperAttributes, ...restProps } = this.props
    const routerProps: RouterProps = { ...restProps, ...wrapperAttributes }

    return (
      <Location>
        {(location => (
          <Router {...routerProps}>
            {this.renderRouteComponent(this.routeNodeTree, location)}
          </Router>
        ))}
      </Location>
    )
  }
}
