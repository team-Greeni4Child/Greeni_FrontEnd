import { request } from "./client";
import { getAccessToken } from "../utils/tokenStorage";

/** 프로필 생성: POST /api/profiles */
export async function createProfile({ profileImage, name, birth }) {
  const accessToken = await getAccessToken();

  return request("/api/profiles", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken || ""}`,
    },
    body: JSON.stringify({ profileImage, name, birth }),
  });
}

/** 프로필 목록 조회: GET /api/profiles/list */
export async function searchProfileList() {
  const accessToken = await getAccessToken();

  return request("/api/profiles/list", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken || ""}`,
    },
  });
}

/** 프로필 단일 조회: GET /api/profiles/{profileId} */
export async function searchSingleProfile(profileId) {
  const accessToken = await getAccessToken();

  return request(`/api/profiles/${profileId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken || ""}`,
    },
  });
}

/** 프로필 삭제: DELETE /api/profiles/{profileId} */
export async function deleteProfile(profileId) {
  const accessToken = await getAccessToken();

  return request(`/api/profiles/${profileId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken || ""}`,
    },
  });
}

/** 프로필 수정: PATCH /api/profiles/{profileId} */
export async function modifyProfile(profileId, { profileImage, name, birth }) {
  const accessToken = await getAccessToken();

  return request(`/api/profiles/${profileId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${accessToken || ""}`,
    },
    body: JSON.stringify({ profileImage, name, birth }),
  });
}