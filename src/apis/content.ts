import { getData } from "./axiosClient"

export const getContents = (creatorId: string, status: string, limit: number, page: number) => {
    return getData(`/api/v1/creator/${creatorId}/contents?status=${status}&limit=${limit}&page=${page}`)
}

export const getContentDetail = (id: string) => {
    return getData(`/api/v1/content/${id}`)
}