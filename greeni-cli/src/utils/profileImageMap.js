/** profielImage 문자열 <-> React Native 이미지 매핑 파일 */

export const PROFILE_IMAGE_FILES = [
  "basic_greeni_pink.png",
  "basic_greeni_green.png",
  "quiz_greeni_pink.png",
  "quiz_greeni_green.png",
  "20_greeni_pink.png",
  "20_greeni_green.png",
  "umbrella_greeni_pink.png",
  "umbrella_greeni_green.png",
  "mustache_greeni_pink.png",
  "mustache_greeni_green.png",
];

export function toImageSource(profileImage) {
  switch (profileImage) {
    case "basic_greeni_pink.png": return require("../assets/images/basic_greeni_pink.png");
    case "basic_greeni_green.png": return require("../assets/images/basic_greeni_green.png");
    case "quiz_greeni_pink.png": return require("../assets/images/quiz_greeni_pink.png");
    case "quiz_greeni_green.png": return require("../assets/images/quiz_greeni_green.png");
    case "20_greeni_pink.png": return require("../assets/images/20_greeni_pink.png");
    case "20_greeni_green.png": return require("../assets/images/20_greeni_green.png");
    case "umbrella_greeni_pink.png": return require("../assets/images/umbrella_greeni_pink.png");
    case "umbrella_greeni_green.png": return require("../assets/images/umbrella_greeni_green.png");
    case "mustache_greeni_pink.png": return require("../assets/images/mustache_greeni_pink.png");
    case "mustache_greeni_green.png": return require("../assets/images/mustache_greeni_green.png");
    default:
      // 혹시 서버가 URL을 주는 경우 대비
      return profileImage ? { uri: profileImage } : require("../assets/images/basic_greeni_pink.png");
  }
}

// RN source(기본이미지 선택) -> 서버에 보낼 문자열
// ProfileImageSelectScreen에서 선택한 index를 같이 넘겨주는 방식이 가장 안전해.
export function fileByIndex(index) {
  return PROFILE_IMAGE_FILES[index] ?? null;
}