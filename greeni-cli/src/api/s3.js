import { Buffer } from "buffer";
import { request } from "./client";
import RNFS from "react-native-fs";

const S3_PUBLIC_BASE_URL = "https://greeni-upload-files.s3.ap-northeast-2.amazonaws.com";

function buildDiaryFileName() {
  return `diary_${Date.now()}.jpg`;
}

function buildPublicUrl(key) {
  if (!key) return "";
  return `${S3_PUBLIC_BASE_URL}/${key}`;
}

export async function createDiaryPresignedUrl(fileName) {
  const params = new URLSearchParams({
    fileName,
    path: "diary",
  });

  const res = await request(`/api/s3-presigned-url?${params.toString()}`, {
    method: "GET",
  });

  const result = res?.result ?? res;

  return {
    url: result?.url || "",
    key: result?.key || "",
  };
}

export async function uploadJpegToPresignedUrl(uploadUrl, base64) {
  console.log("[S3][UPLOAD URL EXISTS]:", !!uploadUrl);
  console.log("[S3][BASE64 LENGTH]:", base64?.length);

  const binary = Buffer.from(base64, "base64");

  console.log("[S3][BINARY LENGTH]:", binary?.length);

  const res = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "image/jpeg",
    },
    body: binary,
  });

  console.log("[S3][PUT STATUS]:", res.status);

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.log("[S3][PUT ERROR BODY]:", text);

    const err = new Error("S3 이미지 업로드에 실패했습니다.");
    err.status = res.status;
    err.body = text;
    throw err;
  }

  return true;
}

export async function uploadDiaryJpeg(base64) {
  if (!base64) {
    throw new Error("업로드할 이미지가 없습니다.");
  }

  const fileName = buildDiaryFileName();
  const presigned = await createDiaryPresignedUrl(fileName);

  if (!presigned?.url) {
    throw new Error("Presigned URL을 받지 못했습니다.");
  }

  await uploadJpegToPresignedUrl(presigned.url, base64);

  return {
    key: presigned.key,
    uploadUrl: presigned.url,
    fileUrl: buildPublicUrl(presigned.key),
  };
}

/* =======================
   아래부터 음성 업로드용 추가
======================= */

function buildDiaryVoiceFileName(filePath = "") {
  const extMatch = filePath.match(/\.(m4a|mp4|aac|mp3|wav)$/i);
  const ext = extMatch ? extMatch[1].toLowerCase() : "m4a";
  return `voice_${Date.now()}.${ext}`;
}

function getAudioContentType(filePath = "") {
  const lower = filePath.toLowerCase();

  if (lower.endsWith(".m4a")) return "audio/mp4";
  if (lower.endsWith(".mp4")) return "audio/mp4";
  if (lower.endsWith(".aac")) return "audio/aac";
  if (lower.endsWith(".mp3")) return "audio/mpeg";
  if (lower.endsWith(".wav")) return "audio/wav";

  return "application/octet-stream";
}

export async function createDiaryVoicePresignedUrl(fileName) {
  const params = new URLSearchParams({
    fileName,
    path: "diary",
  });

  const res = await request(`/api/s3-presigned-url?${params.toString()}`, {
    method: "GET",
  });

  const result = res?.result ?? res;

  return {
    url: result?.url || "",
    key: result?.key || "",
  };
}

export async function uploadAudioFileToPresignedUrl(uploadUrl, filePath) {
  if (!uploadUrl) throw new Error("업로드 URL이 없습니다.");
  if (!filePath) throw new Error("업로드할 음성 파일 경로가 없습니다.");

  const normalizedPath = filePath.startsWith("file://")
    ? filePath.replace("file://", "")
    : filePath;

  const base64 = await RNFS.readFile(normalizedPath, "base64");
  const binary = Buffer.from(base64, "base64");
  const contentType = getAudioContentType(normalizedPath);

  console.log("[S3][AUDIO FILE PATH]:", normalizedPath);
  console.log("[S3][AUDIO CONTENT TYPE]:", contentType);

  const res = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": contentType,
    },
    body: binary,
  });

  console.log("[S3][AUDIO PUT STATUS]:", res.status);

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.log("[S3][AUDIO PUT ERROR BODY]:", text);

    const err = new Error("S3 음성 업로드에 실패했습니다.");
    err.status = res.status;
    err.body = text;
    throw err;
  }

  return true;
}

export async function uploadDiaryVoice(filePath) {
  if (!filePath) {
    throw new Error("업로드할 음성 파일이 없습니다.");
  }

  const fileName = buildDiaryVoiceFileName(filePath);
  const presigned = await createDiaryVoicePresignedUrl(fileName);

  if (!presigned?.url) {
    throw new Error("음성용 Presigned URL을 받지 못했습니다.");
  }

  await uploadAudioFileToPresignedUrl(presigned.url, filePath);

  return {
    key: presigned.key,
    uploadUrl: presigned.url,
    fileUrl: buildPublicUrl(presigned.key),
  };
}
