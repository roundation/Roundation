import * as React from 'react'
import { Router, RouterProps, RouteComponentProps } from '@reach/router'
import Route from './Route'
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

  private renderRouteComponent = (routeNode: RouteNode, props: RouteComponentProps) => {
    const { Layout, Index, Default, children, slots } = routeNode
    const getLocationInfo = this.setCommandContext(routeNode)
    const elementSlots = objectMap(slots, Component => (
      <Component {...props} locationInfo={getLocationInfo('slot')} />
    ))

    return (
      <Layout {...elementSlots} {...props} locationInfo={getLocationInfo('layout')}>
        {[
          // index route component
          Index && (
            <Index key="/" path="/" locationInfo={getLocationInfo('index')} />
          ),
          // normal route components
          ...children.map(this.renderRoute),
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

  private renderRoute = (routeNode: RouteNode) => (
    <Route key={routeNode.routePath} path={routeNode.routePath}>
      {props => this.renderRouteComponent(routeNode, props)}
    </Route>
  )

  render () {
    const { wrapperAttributes, ...restProps } = this.props
    const routerProps = {...restProps, ...wrapperAttributes  } as RouterProps

    return (
      <Router {...routerProps}>
        {this.renderRoute(this.routeNodeTree)}
      </Router>
    )
  }
}
