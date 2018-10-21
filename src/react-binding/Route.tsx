import * as React from 'react'
import { RouteComponentProps, ComponentProps } from '../types'

export interface Props extends RouteComponentProps {
  componentRender: (componentProps: RouteComponentProps) => React.ReactElement<ComponentProps>
}

export const Route: React.SFC<Props> = (props: Props) => {
  const { componentRender, ...restProps } = props

  return componentRender(restProps)
}

export default Route
