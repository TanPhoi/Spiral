import { Campaign } from './Campaign.model';

export type ContentType = {
    id: string;
    campaignId: string;
    creatorId: string;
    urls: string[];
    approved: ContentStatus
    approvedBy: string;
    reason: string;
    caption: string;
    campaign: Campaign
    notes: string;
    isDeleted: boolean;
    deletedAt: string | null;
    createdAt: string;
    updatedAt: string;
    post_due: string;
    suggestedPostDue: string | null;
    isSuggestedPostDueAccepted: number;
    trackingUrl: string;
}

export type ContentStatus = "approved" | "rejected" | "pending" | 'draft' | 'posted'