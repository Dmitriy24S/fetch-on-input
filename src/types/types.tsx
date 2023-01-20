export enum LOADING_STATE {
  LOADING = 'LOADING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR',
  NONE = 'NONE',
}

export interface DataType {
  postId: number
  id: number
  name: string
  email: string
  body: string
}
