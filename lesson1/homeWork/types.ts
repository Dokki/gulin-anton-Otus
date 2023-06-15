export enum TYPES {
  folder,
  file,
}

export type TTreeJson = {
  name: string
  path: string
  is: TYPES
  items?: TTreeJson[]
}

export type TArgs = {
  task: number
  path: string
  depth?: number
}
