import { PLACEHOLDER } from '@/utils/constants'

export const addressInputFields = [
  {
    type: 'text',
    label: 'المنطقة',
    name: 'region',
    placeholder: PLACEHOLDER.address.region,
    autoComplete: 'off',
  },
  {
    type: 'text',
    label: 'الشارع',
    name: 'street',
    placeholder: PLACEHOLDER.address.street,
    autoComplete: 'off',
  },
  {
    type: 'text',
    label: 'المبنى',
    name: 'building',
    placeholder: PLACEHOLDER.address.building,
    autoComplete: 'off',
  },
  {
    type: 'text',
    label: 'علامة مميزة',
    name: 'mark',
    placeholder: PLACEHOLDER.address.mark,
    autoComplete: 'off',
  },
] as const
