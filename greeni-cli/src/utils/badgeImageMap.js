const BADGE_IMAGE_URL_MAP = {
  "roleplay_30.png":
    "https://greeni-upload-files.s3.ap-northeast-2.amazonaws.com/badge/8/06148469-9aa9-49f8-ac77-c9aa606b6b0c/roleplaying_30.png",
  "roleplaying_30.png":
    "https://greeni-upload-files.s3.ap-northeast-2.amazonaws.com/badge/8/06148469-9aa9-49f8-ac77-c9aa606b6b0c/roleplaying_30.png",
  "diary_50.png":
    "https://greeni-upload-files.s3.ap-northeast-2.amazonaws.com/badge/8/0c44bde1-fb9f-48ff-a53b-a3c7c02d5eba/diary_50.png",
  "diary_100.png":
    "https://greeni-upload-files.s3.ap-northeast-2.amazonaws.com/badge/8/148413b1-369c-4544-9181-336c78e570aa/diary_100.png",
  "attendance_10.png":
    "https://greeni-upload-files.s3.ap-northeast-2.amazonaws.com/badge/8/230253ab-c283-40b6-8dba-49259673575e/attendance_10.png",
  "diary_5.png":
    "https://greeni-upload-files.s3.ap-northeast-2.amazonaws.com/badge/8/2b01c0f8-335d-4fb8-9845-d6d819af2d56/diary_5.png",
  "diary_30.png":
    "https://greeni-upload-files.s3.ap-northeast-2.amazonaws.com/badge/8/31e1f059-e15c-4be4-b153-6bc8af4806cb/diary_30.png",
  "diary_1.png":
    "https://greeni-upload-files.s3.ap-northeast-2.amazonaws.com/badge/8/377b78ca-e5ad-4edc-a0fe-a86929efa9ed/diary_1.png",
  "diary_10.png":
    "https://greeni-upload-files.s3.ap-northeast-2.amazonaws.com/badge/8/5c8dcdad-566a-4741-b9e6-b750a2cf4355/diary_10.png",
  "fiveq_50.png":
    "https://greeni-upload-files.s3.ap-northeast-2.amazonaws.com/badge/8/64be3c3c-0b22-43dc-8bc7-1cd1784c82b1/fiveq_50.png",
  "roleplay_50.png":
    "https://greeni-upload-files.s3.ap-northeast-2.amazonaws.com/badge/8/6d971f42-e7ca-4f63-b8ab-2a71016fd805/roleplaying_50.png",
  "roleplaying_50.png":
    "https://greeni-upload-files.s3.ap-northeast-2.amazonaws.com/badge/8/6d971f42-e7ca-4f63-b8ab-2a71016fd805/roleplaying_50.png",
  "fiveq_30.png":
    "https://greeni-upload-files.s3.ap-northeast-2.amazonaws.com/badge/8/6f34fbeb-99bf-49b4-8398-b2e38bffd352/fiveq_30.png",
  "attendance_50.png":
    "https://greeni-upload-files.s3.ap-northeast-2.amazonaws.com/badge/8/6f3f5e5c-c8e6-4712-9b10-64b1533c1f8c/attendance_50.png",
  "attendance_30.png":
    "https://greeni-upload-files.s3.ap-northeast-2.amazonaws.com/badge/8/87f1a23c-1128-400e-818a-fe5851d17243/attendance_30.png",
  "attendance_100.png":
    "https://greeni-upload-files.s3.ap-northeast-2.amazonaws.com/badge/8/8bf9dbaf-1edf-4b2f-ace0-9d88b275e18a/attendance_100.png",
  "fiveq_100.png":
    "https://greeni-upload-files.s3.ap-northeast-2.amazonaws.com/badge/8/a0cbb3c3-38ba-4218-80c0-7ef6b8584a47/fiveq_100.png",
  "roleplay_1.png":
    "https://greeni-upload-files.s3.ap-northeast-2.amazonaws.com/badge/8/a8b2f674-7b52-479b-a1cd-fe4f9caa24a6/roleplaying_1.png",
  "roleplaying_1.png":
    "https://greeni-upload-files.s3.ap-northeast-2.amazonaws.com/badge/8/a8b2f674-7b52-479b-a1cd-fe4f9caa24a6/roleplaying_1.png",
  "fiveq_1.png":
    "https://greeni-upload-files.s3.ap-northeast-2.amazonaws.com/badge/8/a944e04a-792b-4621-81d2-46446c85b386/fiveq_1.png",
  "fiveq_5.png":
    "https://greeni-upload-files.s3.ap-northeast-2.amazonaws.com/badge/8/b79cfb68-308d-4dd6-81fd-7ba6af598386/fiveq_5.png",
  "attendance_1.png":
    "https://greeni-upload-files.s3.ap-northeast-2.amazonaws.com/badge/8/b9e686f6-7118-4a85-afff-e375d63f83f5/attendance_1.png",
  "roleplay_10.png":
    "https://greeni-upload-files.s3.ap-northeast-2.amazonaws.com/badge/8/bf805d57-dc63-4cf7-be1f-9a5f96444c63/roleplaying_10.png",
  "roleplaying_10.png":
    "https://greeni-upload-files.s3.ap-northeast-2.amazonaws.com/badge/8/bf805d57-dc63-4cf7-be1f-9a5f96444c63/roleplaying_10.png",
  "roleplay_5.png":
    "https://greeni-upload-files.s3.ap-northeast-2.amazonaws.com/badge/8/c30314e2-6594-4866-b8d9-ba13d71ab79f/roleplaying_5.png",
  "roleplaying_5.png":
    "https://greeni-upload-files.s3.ap-northeast-2.amazonaws.com/badge/8/c30314e2-6594-4866-b8d9-ba13d71ab79f/roleplaying_5.png",
  "fiveq_10.png":
    "https://greeni-upload-files.s3.ap-northeast-2.amazonaws.com/badge/8/cb06c343-77c7-46ed-8d28-887cad05d308/fiveq_10.png",
  "attendance_5.png":
    "https://greeni-upload-files.s3.ap-northeast-2.amazonaws.com/badge/8/fb5beb67-50e3-49a1-8b35-5a92ea399adb/attendance_5.png",
  "roleplay_100.png":
    "https://greeni-upload-files.s3.ap-northeast-2.amazonaws.com/badge/8/fff67f51-a07c-49d2-a61c-56f7f6917bbe/roleplaying_100.png",
  "roleplaying_100.png":
    "https://greeni-upload-files.s3.ap-northeast-2.amazonaws.com/badge/8/fff67f51-a07c-49d2-a61c-56f7f6917bbe/roleplaying_100.png",
};

export function toBadgeImageUrl(imageUrl) {
  if (!imageUrl || typeof imageUrl !== "string") return null;
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) return imageUrl;
  return BADGE_IMAGE_URL_MAP[imageUrl] ?? null;
}
