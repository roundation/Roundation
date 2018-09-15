import * as React from 'react'
import { Router } from '@reach/router'
import objectMap from './utils/object-map'
import bootstrap from './bootstrap'
import { RouteNode } from './types.d'
import setupLocationWorkspace from './core/setupLocationWorkspace'

export default class Roundation extends React.PureComponent {
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
    return (
      <Router>
        {this.renderRouteComponent(this.routeNodeTree)}
      </Router>
    )
  }
}
