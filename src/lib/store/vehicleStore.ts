import { create } from 'zustand'
import { v4 as uuid } from 'uuid'
import { persist } from 'zustand/middleware'

export type Vehicle = {
  id: string
  brand: string
  plate: string
}

export type State = {
  vehicles: Vehicle[]
}

export type Actions = {
  addVehicle: (brand: string, plate: string) => void
  removeVehicle: (id: string) => void
  updateVehicle: (id: string, brand: string, plate: string) => void
}

export const useVehicleStore = create<State & Actions>()(
  persist(
    set => ({
      vehicles: [],
      addVehicle: (brand: string, plate: string) =>
        set(state => ({
          vehicles: [
            ...state.vehicles,
            { id: uuid(), brand, plate }
          ]
        })),
        removeVehicle: (id: string) =>
        set(state => ({
          vehicles: state.vehicles.filter(vehicle => vehicle.id !== id)
        })),
        updateVehicle: (id: string, brand: string, plate: string) =>
        set(state => ({
          vehicles: state.vehicles.map(vehicle =>
            vehicle.id === id ? { ...vehicle, brand, plate} : vehicle
          )
        }))
    }),
    { name: 'vehicle-store', skipHydration: true }
  )
)