import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY_ACCESS = "accessToken";
const KEY_REFRESH = "refreshToken";
const KEY_MEMBER_ID = "memberId";

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

export async function clearAuth() {
  await AsyncStorage.multiRemove([KEY_ACCESS, KEY_REFRESH, KEY_MEMBER_ID]);
}
