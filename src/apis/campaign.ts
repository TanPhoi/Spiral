import {getData, postData} from './axiosClient';

export const getExploreCampaign = (limit: number, page: number) => {
  return getData(`/campaign/api/v1/campaign?limit=${limit}&page=${page}`);
};

export const getCampaigns = (
  creatorId: string,
  limit: number,
  page: number,
  status: string,
) => {
  return getData(
    `/campaign/api/v1/campaign-creator/invited-campaigns?creatorId=${creatorId}&limit=${limit}&page=${page}&status=${status}`,
  );
};

export const responseInvitationOfBrand = (
  campaignId: string,
  status: boolean,
) => {
  return postData(`/campaign/api/v1/creator/${campaignId}/invite-response`, {
    accepted: status,
    campaignId,
  });
};

export const getCampaignDetails = (id: string) => {
  return getData(`/campaign/api/v1/campaign-creator/${id}/details-for-creator`);
};

export const draftContent = (campaignId: string, payload: any) => {
  return postData(
    `/campaign/api/v1/creator/${campaignId}/draft-content`,
    payload,
  );
};

export const uploadContent = (campaignId: string, payload: any) => {
  return postData(
    `/campaign/api/v1/creator/${campaignId}/upload-content`,
    payload,
  );
};
