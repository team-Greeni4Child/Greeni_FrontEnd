import { API_BASE_URL } from "../config/env";

export class ApiError extends Error {
  constructor({ status, code, message, result }) {
    super(message || "API Error");
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.result = result;
  }
}

// 지연용 유틸
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// 네트워크 실패(Network request failed)일 때만 최대 2회 재시도
async function fetchWithRetry(url, options, retry = 2) {
  try {
    return await fetch(url, options);
  } catch (err) {
    const msg = err?.message || "";
    const isNetworkFail = msg.includes("Network request failed");

    if (isNetworkFail && retry > 0) {
      await sleep(300);
      return await fetchWithRetry(url, options, retry - 1);
    }

    // 재시도 대상이 아니면 그대로 throw
    throw err;
  }
}

export async function request(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;

  const fetchOptions = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  };

  let res;
  try {
    res = await fetchWithRetry(url, fetchOptions, 2);
  } catch (err) {
    // 네트워크 레벨 실패는 ApiError가 아니라 TypeError 그대로 올라감
    throw err;
  }

  const authorization = res.headers.get("authorization");

  const text = await res.text();
  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = {
      isSuccess: false,
      code: "NON_JSON",
      message: text,
      result: null,
    };
  }

  // HTTP 에러 or 서버 isSuccess=false
  if (!res.ok || data?.isSuccess === false) {
    throw new ApiError({
      status: res.status,
      code: data?.code,
      message: data?.message,
      result: data?.result,
    });
  }

  // 헤더 포함 반환 옵션
  if (options.returnHeaders) {
    return {
      ...data,
      headers: {
        authorization, // 없으면 null
      },
    };
  }

  return data;
}
