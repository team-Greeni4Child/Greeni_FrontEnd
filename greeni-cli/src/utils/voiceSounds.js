import Sound from "react-native-nitro-sound";
import RNFS from "react-native-fs";

const VOICE_ASSET_DIR = "sounds/voices";
const VOICE_CACHE_DIR = `${RNFS.CachesDirectoryPath}/sounds/voices`;

let currentVoicePath = null;
let currentVoiceFinish = null;
let isStoppingVoice = false;

async function getCachedVoicePath(filePath) {
  const normalizedFilePath = filePath.replace(/^\/+/, "");
  const cachePath = `${VOICE_CACHE_DIR}/${normalizedFilePath}`;
  const cacheDir = cachePath.slice(0, cachePath.lastIndexOf("/"));
  const exists = await RNFS.exists(cachePath);

  if (!exists) {
    await RNFS.mkdir(cacheDir);
    await RNFS.copyFileAssets(`${VOICE_ASSET_DIR}/${normalizedFilePath}`, cachePath);
  }

  return cachePath;
}

export async function stopVoiceSound() {
  if (isStoppingVoice) return;

  try {
    isStoppingVoice = true;

    if (currentVoiceFinish) {
      await currentVoiceFinish(false);
      return;
    }

    await Sound.stopPlayer().catch(() => {});
    Sound.removePlayBackListener?.();
    Sound.removePlaybackEndListener?.();
    await Sound.setVolume(1).catch(() => {});

    currentVoicePath = null;
  } catch (e) {
    console.log("stopVoiceSound error:", e);
  } finally {
    isStoppingVoice = false;
  }
}

async function playVoiceSound(filePath, volume = 1, shouldCancel) {
  const isCancelled = () => {
    return typeof shouldCancel === "function" && shouldCancel();
  };

  try {
    await stopVoiceSound();

    if (isCancelled()) {
      return false;
    }

    const path = await getCachedVoicePath(filePath);

    if (isCancelled()) {
      return false;
    }

    currentVoicePath = path;

    await Sound.stopPlayer().catch(() => {});
    Sound.removePlayBackListener?.();
    Sound.removePlaybackEndListener?.();

    if (isCancelled()) {
      currentVoicePath = null;
      return false;
    }

    return await new Promise((resolve, reject) => {
      let finished = false;

      const finish = async completed => {
        if (finished) return;
        finished = true;

        try {
          await Sound.stopPlayer().catch(() => {});
          Sound.removePlayBackListener?.();
          Sound.removePlaybackEndListener?.();
          await Sound.setVolume(1).catch(() => {});
        } finally {
          if (currentVoicePath === path) {
            currentVoicePath = null;
          }

          if (currentVoiceFinish === finish) {
            currentVoiceFinish = null;
          }

          resolve(completed);
        }
      };

      const start = async () => {
        try {
          currentVoiceFinish = finish;

          await Sound.startPlayer(path);

          if (isCancelled()) {
            await finish(false);
            return;
          }

          await Sound.setVolume(volume).catch(() => {});

          Sound.addPlayBackListener(e => {
            if (isCancelled()) {
              finish(false);
              return;
            }

            if (e.duration > 0 && e.currentPosition >= e.duration) {
              finish(true);
            }
          });

          Sound.addPlaybackEndListener?.(() => {
            if (isCancelled()) {
              finish(false);
              return;
            }

            finish(true);
          });
        } catch (e) {
          if (currentVoicePath === path) {
            currentVoicePath = null;
          }

          if (currentVoiceFinish === finish) {
            currentVoiceFinish = null;
          }

          reject(e);
        }
      };

      start();
    });
  } catch (e) {
    await Sound.setVolume(1).catch(() => {});
    currentVoicePath = null;
    currentVoiceFinish = null;
    console.log("playVoiceSound error:", e);
    throw e;
  }
}

// diary
export function playDiaryStartVoice() {
  return playVoiceSound("diary/diary_start_1.mp3", 1);
}

export function playDiaryDrawVoice() {
  return playVoiceSound("diary/diary_draw.mp3", 1);
}

// five questions
export function playFiveCorrectVoice() {
  return playVoiceSound("five_questions/five_correct.mp3", 1);
}

export function playFiveWrongVoice() {
  return playVoiceSound("five_questions/five_wrong.mp3", 1);
}

// role playing
export function playRoleSelectSituationVoice(shouldCancel) {
  return playVoiceSound("role_playing/role_select_situation.mp3", 1, shouldCancel);
}
