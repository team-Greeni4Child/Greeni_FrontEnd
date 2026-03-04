import { request } from "./client";
import { getAccessToken } from "../utils/tokenStorage";

export async function getProfileCount(profileId) {
  const accessToken = await getAccessToken();
  return request(`/api/statistics/profiles/${profileId}/count`, {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken || ""}` },
  });
}

export async function getTodayKeyword(profileId) {
  const accessToken = await getAccessToken();
  return request(`/api/statistics/diaries/${profileId}/keyword`, {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken || ""}` },
  });
}

export async function getMonthlyEmotionStats(profileId) {
  const accessToken = await getAccessToken();
  return request(`/api/statistics/diaries/${profileId}/emotion`, {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken || ""}` },
  });
}
