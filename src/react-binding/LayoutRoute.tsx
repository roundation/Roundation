import * as React from 'react'
import objectMap from '../utils/object-map'
import objectIsEmpty from '../utils/object-is-empty'
import { LayoutProps, ComponentResolvedCollection, ComponentType, ComponentTypeWithoutSlots } from '../types'

function withoutSlots (
  Component: ComponentType<string> | ComponentType,
  slots: ComponentResolvedCollection,
): Component is ComponentTypeWithoutSlots {
  return objectIsEmpty(slots)
}

export const LayoutRoute: React.FC<LayoutProps<any>> = props => {
  const { Component, children, locationInfo, slots, slotsLocationInfo, ...restProps } = props

  if (withoutSlots(Component, slots)) {
    const ComponentWithoutSlots = Component as ComponentTypeWithoutSlots

    return (
      <ComponentWithoutSlots {...restProps} locationInfo={locationInfo} >{children}</ComponentWithoutSlots>
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
