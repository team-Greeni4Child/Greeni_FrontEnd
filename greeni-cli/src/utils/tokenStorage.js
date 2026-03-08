import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY_ACCESS = "accessToken";
const KEY_REFRESH = "refreshToken";
const KEY_MEMBER_ID = "memberId";
const KEY_SELECTED_PROFILE = "selectedProfile";

export async function saveAuth({ accessToken, refreshToken, memberId }) {
  await AsyncStorage.multiSet([
    [KEY_ACCESS, accessToken ?? ""],
    [KEY_REFRESH, refreshToken ?? ""],
    [KEY_MEMBER_ID, String(memberId ?? "")],
  ]);
}

export async function getAccessToken() {
  return AsyncStorage.getItem(KEY_ACCESS);
}

export async function getRefreshToken() {
  return AsyncStorage.getItem(KEY_REFRESH);
}

export async function getMemberId() {
  return AsyncStorage.getItem(KEY_MEMBER_ID);
}

export async function saveSelectedProfile(profile) {
  await AsyncStorage.setItem(KEY_SELECTED_PROFILE, JSON.stringify(profile));
}

export async function getSelectedProfile() {
  const raw = await AsyncStorage.getItem(KEY_SELECTED_PROFILE);
  return raw ? JSON.parse(raw) : null;
}

export async function clearSelectedProfile() {
  await AsyncStorage.removeItem(KEY_SELECTED_PROFILE);
}

export async function clearAuth() {
  await AsyncStorage.multiRemove([
    KEY_ACCESS,
    KEY_REFRESH,
    KEY_MEMBER_ID,
    KEY_SELECTED_PROFILE,
  ]);
}
