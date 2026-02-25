import { request } from "./client";

/** 이메일 인증 요청: POST /api/members/email */
export function requestEmailVerification(email) {
  return request("/api/members/email", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

/** 비밀번호 찾기(이메일+코드 검증): POST /api/members/password */
export function verifyPasswordResetCode({ email, code }) {
  return request("/api/members/password", {
    method: "POST",
    body: JSON.stringify({ email, code }),
  });
}

/** 비밀번호 재설정: POST /api/members/password/reset */
export function resetPassword({ email, password }) {
  return request("/api/members/password/reset", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

/** 일반 회원가입: POST /api/members/signup */
export function signUp({ email, password, code }) {
  return request("/api/members/signup", {
    method: "POST",
    body: JSON.stringify({ email, password, code }),
  });
}

/** 일반 로그인: POST /api/auth/login */
export function login({ email, password }) {
  return request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    returnHeaders: true,
  });
}
