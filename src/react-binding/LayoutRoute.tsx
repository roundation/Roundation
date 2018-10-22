import * as React from 'react'
import objectMap from '../utils/object-map'
import objectIsEmpty from '../utils/object-is-empty'
import { RouteComponentProps, LocationInfo, ComponentResolvedCollection, ComponentClass } from '../types'

export interface Props extends RouteComponentProps {
  Component: ComponentClass
  children: React.ReactNode
  locationInfo: LocationInfo
  slots: ComponentResolvedCollection
  slotsLocationInfo: LocationInfo
}

export const LayoutRoute: React.SFC<Props> = (props: Props) => {
  const { Component, children, locationInfo, slots, slotsLocationInfo, ...restProps } = props

  if (objectIsEmpty(Component)) {
    return (
      <Component {...restProps} locationInfo={locationInfo}>{children}</Component>
    )
  }

  const elementSlots = objectMap(slots, Slot => (
    <Slot {...restProps} locationInfo={slotsLocationInfo}/>
  ))

  return (
    <Component {...restProps} slots={elementSlots} locationInfo={locationInfo}>{children}</Component>
  )
}

export default LayoutRoute
