import * as React from 'react'
import { Router } from '@reach/router'
import objectMap from './utils/object-map'
import bootstrap from './bootstrap'
import { RouteNode } from './types.d'
import setupCommandWorkspace from './makeCommands'

export default class Roundation extends React.PureComponent {
  private routeNodeTree = bootstrap()
  private setCommandContext = setupCommandWorkspace(this.routeNodeTree)

  private renderRouteComponent = (routeNode: RouteNode) => {
    const { routePath, Layout, Index, Default, children, slots } = routeNode
    const makeCommands = this.setCommandContext(routeNode)
    // const makeParentCommands = this.setCommandContext(parent!)
    const elementSlots = objectMap(slots, Component => (
      <Component commands={makeCommands('slot')}/>
    ))

    return (
      <Layout key={routePath} path={routePath} {...elementSlots} commands={makeCommands('layout')}>
        {[
          // index route component
          Index && (
            <Index key="/" path="/" commands={makeCommands('index')} />
          ),
          // normal route components
          ...children.map(this.renderRouteComponent),
          // default route components
          Default && (
            <Default key="default" default commands={makeCommands('default')} />
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
