import {Brand, User} from './User.model';

export type Campaign = {
  name: string;
  deadline: string;
  id?: string;
  budget: number;
  minAge: number;
  age?: number[];
  maxAge: number;
  gender: 'male' | 'female' | 'all';
  discountType: 'percentage' | 'fixed';
  status: CampaignStatus;
  brand: Brand;
  socialMedia: string[];
  location: string;
  discount: number;
  campaignOverview: string;
  isDeleted?: boolean;
  activatedAt?: string;
  deletedAt?: string;
};

export type CampaignStatus = 'active' | 'draft' | 'archive';

export type InfluencerStatus =
  | 'waiting_to_apply'
  | 'accepted_invitation'
  | 'declined_invitation'
  | 'joined_campaign'
  | 'brand_declined_influencer';

export type Influencer = {
  creator?: User;
  campaign: Campaign;
  status: InfluencerStatus;
  id: string;
};
