import * as React from 'react'
import objectMap from '../utils/object-map'
import objectIsEmpty from '../utils/object-is-empty'
import { LayoutProps, ComponentResolvedCollection, ComponentClass } from '../types'

function withoutSlots (Component: ComponentClass<string> | ComponentClass, slots: ComponentResolvedCollection): Component is ComponentClass {
  return objectIsEmpty(slots)
}

export const LayoutRoute: React.SFC<LayoutProps<any>> = props => {
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
