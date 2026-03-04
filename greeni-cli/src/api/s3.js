import { request } from "./client";
import { getAccessToken } from "../utils/tokenStorage";

function buildUploadFileName(asset) {
  const original = asset?.fileName || "profile.jpg";
  const safe = String(original).replace(/[^a-zA-Z0-9._-]/g, "_");
  return `${Date.now()}_${safe}`;
}

function toPublicUrl(presignedUrl) {
  if (!presignedUrl || typeof presignedUrl !== "string") return "";
  const qIndex = presignedUrl.indexOf("?");
  return qIndex >= 0 ? presignedUrl.slice(0, qIndex) : presignedUrl;
}

function uriToBlob(uri) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onerror = () => reject(new Error("Failed to convert uri to blob"));
    xhr.onload = () => resolve(xhr.response);
    xhr.responseType = "blob";
    xhr.open("GET", uri, true);
    xhr.send(null);
  });
}

export async function getS3PresignedUrl({ path = "profiles", fileName }) {
  const accessToken = await getAccessToken();
  const params = new URLSearchParams({
    path,
    fileName,
  });

  const res = await request(`/api/s3-presigned-url?${params.toString()}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken || ""}`,
    },
  });

  const result = res?.result ?? res;
  return {
    url: result?.url || "",
    key: result?.key || "",
  };
}

export async function uploadImageToS3({ presignedUrl, asset }) {
  const blob = await uriToBlob(asset.uri);
  try {
    const uploadRes = await fetch(presignedUrl, {
      method: "PUT",
      headers: {
        "Content-Type": asset?.type || "image/jpeg",
      },
      body: blob,
    });

    if (!uploadRes.ok) {
      throw new Error(`S3 upload failed: ${uploadRes.status}`);
    }
  } finally {
    if (typeof blob?.close === "function") {
      blob.close();
    }
  }
}

export async function uploadProfileAsset(asset) {
  if (!asset?.uri) {
    throw new Error("Invalid image asset");
  }

  const fileName = buildUploadFileName(asset);
  const { url } = await getS3PresignedUrl({ path: "profiles", fileName });

  if (!url) {
    throw new Error("Failed to get presigned URL");
  }

  await uploadImageToS3({ presignedUrl: url, asset });
  return toPublicUrl(url);
}
