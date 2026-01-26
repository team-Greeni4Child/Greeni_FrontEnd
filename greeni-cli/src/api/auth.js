import { request } from "./client";

/** 이메일 인증 요청: POST /api/members/email */
export function requestEmailVerification(email) {
  return request("/api/members/email", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

/** 일반 회원가입: POST /api/members/signup */
export function signUp({ email, password, code }) {
  return request("/api/members/signup", {
    method: "POST",
    body: JSON.stringify({ email, password, code }),
  });
}
