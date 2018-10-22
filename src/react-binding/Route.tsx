import * as React from 'react'
import { RouteComponentProps, ComponentProps } from '../types'

export type RouteChildren = (componentProps: RouteComponentProps) => React.ReactElement<ComponentProps>

export interface Props extends RouteComponentProps {
  children: RouteChildren
}

export const Route: React.SFC<Props> = (props: Props) => {
  const { children, ...restProps } = props

  // reach router hacked the original children, it is wrapped in `children.props`
  return ((children as any).props.children as RouteChildren)(restProps)
}

export default Route
