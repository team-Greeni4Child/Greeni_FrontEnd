import { API_BASE_URL } from "../config/env";
import { getAccessToken } from "../utils/tokenStorage";

export async function requestRolePlaying({
  sessionId,
  role,
  voicePath,
  temperature,
  topP,
  maxTokens,
}) {
  const accessToken = await getAccessToken();

  const formData = new FormData();
  formData.append("session_id", sessionId);
  formData.append("role", role);
  formData.append("voice", {
    uri: voicePath,
    type: "audio/mp4",
    name: "voice.mp4",
  });

  if (typeof temperature === "number") {
    formData.append("temperature", String(temperature));
  }

  if (typeof topP === "number") {
    formData.append("top_p", String(topP));
  }

  if (typeof maxTokens === "number") {
    formData.append("max_tokens", String(maxTokens));
  }

  const res = await fetch(`${API_BASE_URL}/api/ai/role-playing`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken || ""}`,
    },
    body: formData,
  });

  const data = await res.json();

  if (!res.ok || data?.isSuccess === false) {
    const err = new Error(data?.message || "역할놀이 요청에 실패했습니다.");
    err.status = res.status;
    err.code = data?.code;
    err.result = data?.result;
    throw err;
  }

  return data?.result;
}

export async function closeRolePlaying(sessionId) {
  const accessToken = await getAccessToken();

  const res = await fetch(`${API_BASE_URL}/api/ai/role-playing/close`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken || ""}`,
    },
    body: JSON.stringify({
      session_id: sessionId,
    }),
  });

  const data = await res.json();

  if (!res.ok || data?.isSuccess === false) {
    const err = new Error(data?.message || "역할놀이 종료에 실패했습니다.");
    err.status = res.status;
    err.code = data?.code;
    err.result = data?.result;
    throw err;
  }

  return data?.result;
}
