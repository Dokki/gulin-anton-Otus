export enum TYPES {
  folder,
  file,
}

export type TTreeJson = {
  name: string
  is: TYPES
  isExist?: boolean
  items?: TTreeJson[]
}

export type TArgs = {
  task: number
  path: string
  depth?: number
}
