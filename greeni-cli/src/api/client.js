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

export async function request(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const text = await res.text();
  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { isSuccess: false, code: "NON_JSON", message: text, result: null };
  }

  if (!res.ok || data?.isSuccess === false) {
    throw new ApiError({
      status: res.status,
      code: data?.code,
      message: data?.message,
      result: data?.result,
    });
  }

  return data;
}
