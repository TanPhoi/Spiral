import { ContentStatus } from "@/models/Content.modal"

export const getContentStatus = (status: ContentStatus) => {
    switch (status) {
        case 'approved':
            return { color: '#115E59', background: '#CCFBF1', statusColor: '#14B8A6' }
        case 'pending':
            return { color: '#854D0E', background: '#FFEDD5', statusColor: '#F97316' }
        case 'rejected':
            return { color: '#991B1B', background: '#FEE2E2', statusColor: '#EF4444' }
        case 'posted':
            return { color: '#1F2937', background: '#F3F4F6', statusColor: '#F3F4F6' }
        case 'draft':
            return { color: '#1F2937', background: '#E5E7EB', statusColor: '#E5E7EB' }
        default:
            break;
    }
}

export const FILE_EXTENSIONS = ['jpg', 'heic', 'png', 'webm', 'jpeg'];