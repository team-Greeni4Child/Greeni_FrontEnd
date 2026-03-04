import { request } from "./client";
import { getAccessToken } from "../utils/tokenStorage";

/** 배지 목록 조회: GET /api/badges/list?profileId={profileId} */
export async function searchBadgeList(profileId) {
  const accessToken = await getAccessToken();

  return request(`/api/badges/list?profileId=${encodeURIComponent(profileId)}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken || ""}`,
    },
  });
}
