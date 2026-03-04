import { request } from "./client";
import { getAccessToken } from "../utils/tokenStorage";

/** 역할놀이 활동요약 생성: POST /api/activities/role-playing */
export async function createRolePlayingActivity({ profileId, roleName }) {
  const accessToken = await getAccessToken();

  return request("/api/activites/role-playing", {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken || ""}` },
    body: JSON.stringify({ profileId, roleName }),
  });
}

/** 다섯고개 활동요약 생성: POST /api/activities/five-questions */
export async function createFiveQuestionsActivity({ profileId, count }) {
  const accessToken = await getAccessToken();

  return request("/api/activites/five-questions", {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken || ""}` },
    body: JSON.stringify({ profileId, count }),
  });
}

/** 일별 활동요약 조회(최대 3개): GET /api/activities/day?profileId= */
export async function getDailyActivities(profileId) {
  const accessToken = await getAccessToken();
  console.log("[ACTIVITY] getDailyActivities token exists:", !!accessToken, "len:", accessToken?.length);

  return request(`/api/activites/day?profileId=${encodeURIComponent(profileId)}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken || ""}` },
  });
}

/** 활동요약 목록 조회(커서): GET /api/activities/day/list */
export async function getDailyActivityList({
  profileId,
  cursorCreatedAt,
  cursorId,
  size = 8,
}) {
  const accessToken = await getAccessToken();

  const params = new URLSearchParams();
  params.append("profileId", String(profileId));
  if (cursorCreatedAt) params.append("cursorCreatedAt", cursorCreatedAt);
  if (typeof cursorId === "number") params.append("cursorId", String(cursorId));
  if (typeof size === "number") params.append("size", String(size));

  return request(`/api/activites/day/list?${params.toString()}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken || ""}` },
  });
}
