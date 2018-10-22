import * as React from 'react'
import objectMap from '../utils/object-map'
import { RouteComponentProps, LocationInfo, ComponentResolvedCollection, ComponentClass } from '../types'

export interface Props extends RouteComponentProps {
  Component: ComponentClass
  children: React.ReactNode
  locationInfo: LocationInfo
  slots: ComponentResolvedCollection
  slotsLocationInfo: LocationInfo
}

export const LayoutRoute: React.SFC<Props> = (props: Props) => {
  const { Component, children, slots, slotsLocationInfo, ...restProps } = props

  const elementSlots = objectMap(slots, Slot => (
    <Slot {...restProps} locationInfo={slotsLocationInfo}/>
  ))

  return (
    <Component {...restProps} slots={elementSlots }>{children}</Component>
  )
}

export default LayoutRoute
