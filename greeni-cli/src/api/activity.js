import { request } from "./client";
import { getAccessToken } from "../utils/tokenStorage";

/** 역할놀이 활동요약 생성: POST /api/activities/role-playing */
export async function createRolePlayingActivity({ profileId, roleName }) {
  const accessToken = await getAccessToken();

  return request("/api/activities/role-playing", {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken || ""}` },
    body: JSON.stringify({ profileId, roleName }),
  });
}

/** 다섯고개 활동요약 생성: POST /api/activities/five-questions */
export async function createFiveQuestionsActivity({ profileId, count }) {
  const accessToken = await getAccessToken();

  return request("/api/activities/five-questions", {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken || ""}` },
    body: JSON.stringify({ profileId, count }),
  });
}

/** 일별 활동요약 조회(최대 3개): GET /api/activities/day?profileId= */
export async function getDailyActivities(profileId) {
  const accessToken = await getAccessToken();
  const path = `/api/activities/day?profileId=${encodeURIComponent(profileId)}`;

  const response = await request(path, {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken || ""}` },
  });

  return response;
}

/** 활동요약 목록 조회(커서): GET /api/activities/day/list */
export async function getDailyActivityList({ profileId, cursorCreatedAt, cursorId }) {
  const accessToken = await getAccessToken();

  const params = new URLSearchParams();
  params.append("profileId", String(profileId));
  if (cursorCreatedAt) params.append("cursorCreatedAt", cursorCreatedAt);
  if (typeof cursorId === "number") params.append("cursorId", String(cursorId));

  const path = `/api/activities/day/list?${params.toString()}`;

  const response = await request(path, {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken || ""}` },
  });

  return response;
}
