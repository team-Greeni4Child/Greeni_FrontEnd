import { request } from "./client";
import { getAccessToken } from "../utils/tokenStorage";

/** 월별 일기 목록 조회: GET /api/diaries/month */
export async function getDiariesByMonth({ year, month, profileId }) {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    throw new Error("NO_ACCESS_TOKEN");
  }

  const qs = new URLSearchParams({
    year: String(year),
    month: String(month),
    profileId: String(profileId),
  }).toString();

  return request(`/api/diaries/month?${qs}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}