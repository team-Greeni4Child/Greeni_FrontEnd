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

async function playVoiceSound(filePath, volume = 1) {
  try {
    await stopVoiceSound();

    const path = await getCachedVoicePath(filePath);
    currentVoicePath = path;

    await Sound.stopPlayer().catch(() => {});
    Sound.removePlayBackListener?.();
    Sound.removePlaybackEndListener?.();

    await Sound.startPlayer(path);
    await Sound.setVolume(volume).catch(() => {});

    return await new Promise(resolve => {
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

      currentVoiceFinish = finish;

      Sound.addPlayBackListener(e => {
        if (e.duration > 0 && e.currentPosition >= e.duration) {
          finish(true);
        }
      });

      Sound.addPlaybackEndListener?.(() => {
        finish(true);
      });
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
