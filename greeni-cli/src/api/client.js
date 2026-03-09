import { API_BASE_URL } from "../config/env";
import { getAccessToken, getRefreshToken, getMemberId, saveAuth, clearAuth } from "../utils/tokenStorage";
import { emitLogout } from "../utils/authEvents";

export class ApiError extends Error {
  constructor({ status, code, message, result }) {
    super(message || "API Error");
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.result = result;
  }
}

// refresh token으로 access token을 다시 발급받는 API 경로
const REFRESH_PATH = "/api/auth/reissue";

// 잠깐 기다릴 때 쓰는 함수
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// fetch 자체가 실패했을 때만 최대 2회 재시도
// 예: 인터넷 끊김, 서버 연결 실패, 에뮬레이터 네트워크 문제
// 401, 404 같은 HTTP 응답은 fetch 성공으로 들어오므로 여기서 재시도되지 않음
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

    // 네트워크 자체가 아닌 다른 오류거나 재시도 횟수를 다 썼으면 그대로 던짐
    throw err;
  }
}

// 서버 응답을 공통으로 읽는 함수
// 1) authorization 헤더 꺼냄
// 2) body를 text로 읽고 JSON으로 파싱
// 3) JSON이 아니면 NON_JSON 형태로 강제 변환
async function parseResponse(res) {
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

  return {
    authorization,
    data,
  };
}

// 실제 요청을 1번만 보내는 함수
// 여기서는 "재발급"이나 "401 처리"를 하지 않고
// 순수하게 요청 + 응답 파싱만 담당
async function requestOnce(path, options = {}) {
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
    // fetch 자체 실패는 TypeError 그대로 올림
    throw err;
  }

  const { authorization, data } = await parseResponse(res);

  return {
    res,
    authorization,
    data,
  };
}

// refreshToken을 이용해서 새 accessToken을 받는 함수
// 성공하면 AsyncStorage에도 새 토큰으로 다시 저장
async function refreshAccessToken() {
  const refreshToken = await getRefreshToken();
  const memberId = await getMemberId();

  // refreshToken 자체가 없으면 재발급 불가
  if (!refreshToken) {
    throw new ApiError({
      status: 401,
      code: "NO_REFRESH_TOKEN",
      message: "refreshToken이 없습니다.",
      result: null,
    });
  }

  // refresh API 호출
  // 백엔드 명세에 따라 Refresh-Token 헤더로 보냄
  const refreshRes = await requestOnce(REFRESH_PATH, {
    method: "POST",
    headers: {
      "Refresh-Token": refreshToken,
    },
  });

  const res = refreshRes.res;
  const authorization = refreshRes.authorization;
  const data = refreshRes.data;

  // 재발급 자체가 실패하면 로그인 정보 정리
  if (!res.ok || data?.isSuccess === false) {
    await clearAuth();
    emitLogout();
    throw new ApiError({
      status: res.status,
      code: data?.code,
      message: data?.message,
      result: data?.result,
    });
  }

  // 새 accessToken은 보통 authorization 헤더에서 꺼냄
  const newAccessToken = authorization?.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : authorization;

  // refreshToken이 새로 오면 교체하고, 안 오면 기존 값 유지
  const newRefreshToken = data?.result?.refreshToken ?? refreshToken;

  // memberId도 새 값이 오면 교체, 없으면 기존 값 유지
  const newMemberId = data?.result?.memberId ?? memberId;

  // 새 accessToken이 없으면 정상 재발급이 아님
  if (!newAccessToken) {
    await clearAuth();
    emitLogout();
    throw new ApiError({
      status: 401,
      code: "NO_NEW_ACCESS_TOKEN",
      message: "재발급된 accessToken이 없습니다.",
      result: data?.result,
    });
  }

  // 새 토큰 저장
  await saveAuth({
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    memberId: newMemberId,
  });

  return newAccessToken;
}

// 앱에서 실제로 쓰는 공통 요청 함수
// 흐름:
// 1) 저장된 accessToken을 헤더에 붙여서 요청
// 2) 401이면 refreshToken으로 accessToken 재발급
// 3) 새 accessToken으로 같은 요청을 1번 다시 보냄
export async function request(path, options = {}) {
  const accessToken = await getAccessToken();

  const authHeaders = {
    ...(options.headers || {}),
  };

  // 이미 Authorization 헤더를 직접 넣지 않았다면
  // 저장된 accessToken을 자동으로 붙여줌
  if (accessToken && !authHeaders.Authorization) {
    authHeaders.Authorization = `Bearer ${accessToken}`;
  }

  // 첫 요청
  const first = await requestOnce(path, {
    ...options,
    headers: authHeaders,
  });

  const res = first.res;
  const authorization = first.authorization;
  const data = first.data;

  // accessToken 만료 등으로 401이 나오면
  // refresh API를 호출해서 새 accessToken을 받고
  // 같은 요청을 1번만 다시 시도
  if (res.status === 401 && path !== REFRESH_PATH) {
    const newAccessToken = await refreshAccessToken();

    const retryHeaders = {
      ...(options.headers || {}),
      Authorization: `Bearer ${newAccessToken}`,
    };

    const second = await requestOnce(path, {
      ...options,
      headers: retryHeaders,
    });

    const retryRes = second.res;
    const retryAuthorization = second.authorization;
    const retryData = second.data;

    // 재시도 후에도 실패하면 최종 에러로 처리
    if (!retryRes.ok || retryData?.isSuccess === false) {
      throw new ApiError({
        status: retryRes.status,
        code: retryData?.code,
        message: retryData?.message,
        result: retryData?.result,
      });
    }

    // 어떤 API는 로그인처럼 authorization 헤더를 같이 받아야 하므로
    // options.returnHeaders가 있으면 헤더도 함께 반환
    if (options.returnHeaders) {
      return {
        ...retryData,
        headers: {
          authorization: retryAuthorization,
        },
      };
    }

    return retryData;
  }

  // 401이 아니더라도 400, 403, 404, 500 같은 실패 응답이면 에러 처리
  if (!res.ok || data?.isSuccess === false) {
    throw new ApiError({
      status: res.status,
      code: data?.code,
      message: data?.message,
      result: data?.result,
    });
  }

  // 성공 + 헤더도 필요하면 같이 반환
  if (options.returnHeaders) {
    return {
      ...data,
      headers: {
        authorization, // 없으면 null
      },
    };
  }

  // 일반적인 성공 응답은 body만 반환
  return data;
}
