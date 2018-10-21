import * as React from 'react'
import { RouteComponentProps, ComponentProps } from '../types'

export interface Props extends RouteComponentProps {
  children: (componentProps: RouteComponentProps) => React.ReactElement<ComponentProps>
}

export const Route: React.SFC<Props> = (props: Props) => {
  const { children, ...restProps } = props

  return children(restProps)
}

export default Route
