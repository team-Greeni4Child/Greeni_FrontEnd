import RNFS from "react-native-fs";
import Sound from "react-native-nitro-sound";

let currentAudioPath = null;
let isStoppingAudio = false;

export async function playBase64Mp3(base64) {
  const path = `${RNFS.CachesDirectoryPath}/ai_${Date.now()}.mp3`;
  currentAudioPath = path;
  isStoppingAudio = false;

  try {
    await RNFS.writeFile(path, base64, "base64");

    await Sound.stopPlayer().catch(() => {});
    Sound.removePlayBackListener();

    await Sound.startPlayer(path);

    return await new Promise((resolve, reject) => {
      Sound.addPlayBackListener(e => {
        if (e.currentPosition >= e.duration && e.duration > 0) {
          Sound.stopPlayer()
            .catch(() => {})
            .finally(() => {
              Sound.removePlayBackListener();

              if (currentAudioPath === path) {
                currentAudioPath = null;
              }

              RNFS.unlink(path).catch(() => {});
              resolve(true);
            });
        }
      });
    });
  } catch (e) {
    console.log("playBase64Mp3 error:", e);

    if (currentAudioPath === path) {
      currentAudioPath = null;
    }

    RNFS.unlink(path).catch(() => {});
    throw e;
  }
}

export async function stopAiAudio() {
  if (isStoppingAudio) return;

  try {
    isStoppingAudio = true;

    await Sound.stopPlayer().catch(() => {});
    Sound.removePlayBackListener();

    if (currentAudioPath) {
      const path = currentAudioPath;
      currentAudioPath = null;
      await RNFS.unlink(path).catch(() => {});
    }
  } catch (e) {
    console.log("stopAiAudio error:", e);
  } finally {
    isStoppingAudio = false;
  }
}
