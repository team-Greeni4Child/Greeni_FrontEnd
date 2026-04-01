import { request } from "./client";
import { getAccessToken } from "../utils/tokenStorage";

export async function requestDiaryAi({ profileId, sessionId, voiceUrl, filePath }) {
  const accessToken = await getAccessToken();
  if (!accessToken) throw new Error("NO_ACCESS_TOKEN");

  if (!profileId) throw new Error("profileId가 없습니다.");
  if (!sessionId) throw new Error("sessionId가 없습니다.");
  if (!voiceUrl) throw new Error("voiceUrl이 없습니다.");
  if (!filePath) throw new Error("filePath가 없습니다.");

  const lower = filePath.toLowerCase();

  let type = "audio/mp4";
  if (lower.endsWith(".mp3")) type = "audio/mpeg";
  else if (lower.endsWith(".wav")) type = "audio/wav";
  else if (lower.endsWith(".aac")) type = "audio/aac";
  else if (lower.endsWith(".m4a")) type = "audio/mp4";
  else if (lower.endsWith(".mp4")) type = "audio/mp4";

  const name = filePath.split("/").pop() || `voice_${Date.now()}.m4a`;
  const uri = filePath.startsWith("file://") ? filePath : `file://${filePath}`;

  const formData = new FormData();
  formData.append("profileId", String(profileId));
  formData.append("session_id", sessionId);
  formData.append("voiceUrl", voiceUrl);
  formData.append("voice", {
    uri,
    name,
    type,
  });

  return request("/api/ai/diaries", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: formData,
    isFormData: true,
  });
}

export async function summarizeDiaryAi({ profileId, sessionId, imageUrl }) {
  const accessToken = await getAccessToken();
  if (!accessToken) throw new Error("NO_ACCESS_TOKEN");

  const qs = new URLSearchParams({
    profileId: String(profileId),
    session_id: sessionId,
    imageUrl: imageUrl || "",
  }).toString();

  return request(`/api/ai/diaries/summarize?${qs}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export async function closeDiaryAi({ profileId, sessionId, status = "ended" }) {
  const accessToken = await getAccessToken();
  if (!accessToken) throw new Error("NO_ACCESS_TOKEN");

  const qs = new URLSearchParams({
    profileId: String(profileId),
    session_id: sessionId,
    status,
  }).toString();

  return request(`/api/ai/diaries/close?${qs}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
