import { create } from 'zustand'
import { v4 as uuid } from 'uuid'
import { persist } from 'zustand/middleware'

export type Driver = {
  id: string
  name: string
  document: string
  vehicle?: string
}

export type State = {
  drivers: Driver[]
}

export type Actions = {
  addDriver: (name: string, document: string, vehicle?: string) => void
  removeDriver: (id: string) => void
  updateDriver: (id: string, name: string, document: string, vehicle: string) => void
}

export const useDriverStore = create<State & Actions>()(
  persist(
    set => ({
      drivers: [],
      addDriver: (name: string, document: string, vehicle?: string) =>
        set(state => ({
          drivers: [
            ...state.drivers,
            { id: uuid(), name, document, vehicle }
          ]
        })),
      removeDriver: (id: string) =>
        set(state => ({
          drivers: state.drivers.filter(driver => driver.id !== id)
        })),
      updateDriver: (id: string, name: string, document: string, vehicle: string) =>
        set(state => ({
          drivers: state.drivers.map(driver =>
            driver.id === id ? { ...driver, name, document, vehicle} : driver
          )
        }))
    }),
    { name: 'driver-store', skipHydration: true }
  )
)