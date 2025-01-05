import { User } from "@/models/User.model";
import { postData } from "./axiosClient";

export const editProfile = (id: string, payload: User) => {
    return postData(`/api/v1/creator/${id}/edit-profile`, payload)
}