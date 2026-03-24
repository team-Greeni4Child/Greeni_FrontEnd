import RNFS from "react-native-fs";
import Sound from "react-native-nitro-sound";

export async function playBase64Mp3(base64) {
  const path = `${RNFS.CachesDirectoryPath}/ai_${Date.now()}.mp3`;

  try {
    await RNFS.writeFile(path, base64, "base64");

    await Sound.stopPlayer().catch(() => {});
    Sound.removePlayBackListener();

    await Sound.startPlayer(path);

    Sound.addPlayBackListener(e => {
      if (e.currentPosition >= e.duration && e.duration > 0) {
        Sound.stopPlayer()
          .catch(() => {})
          .finally(() => {
            Sound.removePlayBackListener();
            RNFS.unlink(path).catch(() => {});
          });
      }
    });
  } catch (e) {
    console.log("playBase64Mp3 error:", e);
    RNFS.unlink(path).catch(() => {});
  }
}
