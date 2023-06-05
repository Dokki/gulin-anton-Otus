export const TYPES = {
  folder: 'folder',
  file: 'file',
}

export type TTreeJson = {
  name: string
  path: string
  is: typeof TYPES.folder | typeof TYPES.file
  items?: TTreeJson[]
}
