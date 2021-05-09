import * as React from 'react'
import objectMap from '../utils/object-map'
import objectIsEmpty from '../utils/object-is-empty'
import { LayoutProps, ComponentResolvedCollection, ComponentType } from '../types'

function withoutSlots (
  Component: ComponentType<string> | ComponentType,
  slots: ComponentResolvedCollection,
): Component is ComponentType {
  return objectIsEmpty(slots)
}

export const LayoutRoute: React.FC<LayoutProps<any>> = props => {
  const { Component, children, locationInfo, slots, slotsLocationInfo, ...restProps } = props

  if (withoutSlots(Component, slots)) {
    return (
      <Component
        {...restProps}
        locationInfo={locationInfo}
      >{children}</Component>
    )
  }

  const elementSlots = objectMap(slots, Slot => (
    <Slot {...restProps} locationInfo={slotsLocationInfo}/>
  ))

  return (
    <Component
      {...restProps}
      slots={elementSlots}
      locationInfo={locationInfo}
    >
      {children}
    </Component>
  )
}

export default LayoutRoute
