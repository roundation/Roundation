import * as React from 'react'
import { Router, RouterProps } from '@reach/router'
import objectMap from '../utils/object-map'
import bootstrap from '../core/bootstrap'
import { RouteNode } from '../types'
import setupLocationWorkspace from '../core/setupLocationWorkspace'

export interface Props extends RouterProps {
  wrapperAttributes?: React.HTMLAttributes<HTMLDivElement>
}

export default class Roundation extends React.PureComponent<Props> {
  private routeNodeTree = bootstrap()
  private setCommandContext = setupLocationWorkspace(this.routeNodeTree)

  private renderRouteComponent = (routeNode: RouteNode) => {
    const { routePath, Layout, Index, Default, children, slots } = routeNode
    const getLocationInfo = this.setCommandContext(routeNode)
    const elementSlots = objectMap(slots, Component => (
      <Component locationInfo={getLocationInfo('slot')}/>
    ))

    return (
      <Layout key={routePath} path={routePath} {...elementSlots} locationInfo={getLocationInfo('layout')}>
        {[
          // index route component
          Index && (
            <Index key="/" path="/" locationInfo={getLocationInfo('index')} />
          ),
          // normal route components
          ...children.map(this.renderRouteComponent),
          // default route components
          Default && (
            <Default key="default" default locationInfo={getLocationInfo('default')} />
          ),
        ]
          .filter(exist => !!exist)
        }
      </Layout>
    )
  }

  render () {
    const { wrapperAttributes, ...restProps } = this.props
    const routerProps = {...restProps, ...wrapperAttributes  } as RouterProps

    return (
      <Router {...routerProps}>
        {this.renderRouteComponent(this.routeNodeTree)}
      </Router>
    )
  }
}
