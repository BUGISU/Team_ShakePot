interface Feed {
  fno: number
  title: string
  photosDTOList: {path: string}[]
  reviewsCnt: number
  likes: number
  regDate: string
}

// PageRequestDTO 구조 정의
interface PageRequestDTO {
  page: string
  size: string
  type: string
  keyword: string
}

// PageResultDTO 구조 정의
interface PageResultDTO {
  dtoList: Feed[]
  page: number
  start: number
  end: number
  pageList: number[]
  prev: boolean
  next: boolean
}
