import Sound from "react-native-nitro-sound";
import RNFS from "react-native-fs";

const EFFECT_ASSET_DIR = "sounds/effects";
const EFFECT_CACHE_DIR = `${RNFS.CachesDirectoryPath}/sounds/effects`;
const EFFECT_END_OFFSET_MS = 1500;
const HINT_END_OFFSET_MS = 1000;

async function getCachedEffectPath(fileName) {
  const cachePath = `${EFFECT_CACHE_DIR}/${fileName}`;
  const exists = await RNFS.exists(cachePath);

  if (!exists) {
    await RNFS.mkdir(EFFECT_CACHE_DIR);
    await RNFS.copyFileAssets(`${EFFECT_ASSET_DIR}/${fileName}`, cachePath);
  }

  return cachePath;
}

// BackButton
export async function playBackButtonSound() {
  try {
    const path = await getCachedEffectPath("back_button.mp3");

    await Sound.stopPlayer().catch(() => {});
    Sound.removePlayBackListener?.();

    await Sound.startPlayer(path);
    await Sound.setVolume(0.3).catch(() => {});

    Sound.addPlayBackListener(e => {
      if (e.currentPosition >= e.duration) {
        Sound.stopPlayer()
          .catch(() => {})
          .finally(() => {
            Sound.removePlayBackListener?.();
            Sound.setVolume(1).catch(() => {});
          });
      }
    });
  } catch (e) {
    Sound.setVolume(1).catch(() => {});
  }
}

// Button
export async function playButtonSound() {
  try {
    const path = await getCachedEffectPath("button.mp3");

    await Sound.stopPlayer().catch(() => {});
    Sound.removePlayBackListener?.();

    await Sound.startPlayer(path);
    await Sound.setVolume(1.5).catch(() => {});

    Sound.addPlayBackListener(e => {
      if (e.currentPosition >= e.duration) {
        Sound.stopPlayer()
          .catch(() => {})
          .finally(() => {
            Sound.removePlayBackListener?.();
            Sound.setVolume(1).catch(() => {});
          });
      }
    });
  } catch (e) {
    Sound.setVolume(1).catch(() => {});
  }
}

// Correct / Wrong
async function playEffectSound(fileName, label) {
  try {
    const path = await getCachedEffectPath(fileName);

    await Sound.stopPlayer().catch(() => {});
    Sound.removePlayBackListener?.();
    Sound.removePlaybackEndListener?.();

    await Sound.startPlayer(path);
    await Sound.setVolume(0.4).catch(() => {});

    return await new Promise(resolve => {
      let finished = false;

      const finish = async () => {
        if (finished) return;
        finished = true;

        await Sound.stopPlayer()
          .catch(() => {})
          .finally(() => {
            Sound.removePlayBackListener?.();
            Sound.removePlaybackEndListener?.();
            Sound.setVolume(1).catch(() => {});
            resolve(true);
          });
      };

      Sound.addPlayBackListener(e => {
        if (e.duration > 0 && e.currentPosition >= e.duration - EFFECT_END_OFFSET_MS) {
          finish();
        }
      });

      Sound.addPlaybackEndListener?.(() => {
        finish();
      });
    });
  } catch (e) {
    console.log(label, e);
    Sound.setVolume(1).catch(() => {});
  }
}

export function playCorrectSound() {
  return playEffectSound("correct.mp3", "PLAY CORRECT SOUND");
}

export function playWrongSound() {
  return playEffectSound("wrong.mp3", "PLAY WRONG SOUND");
}

// Hint
export async function playHintSound() {
  try {
    const path = await getCachedEffectPath("hint.mp3");

    await Sound.stopPlayer().catch(() => {});
    Sound.removePlayBackListener?.();
    Sound.removePlaybackEndListener?.();

    await Sound.startPlayer(path);
    await Sound.setVolume(0.5).catch(() => {});

    return await new Promise(resolve => {
      let finished = false;

      const finish = async () => {
        if (finished) return;
        finished = true;

        await Sound.stopPlayer()
          .catch(() => {})
          .finally(() => {
            Sound.removePlayBackListener?.();
            Sound.removePlaybackEndListener?.();
            Sound.setVolume(1).catch(() => {});
            resolve(true);
          });
      };

      Sound.addPlayBackListener(e => {
        if (e.duration > 0 && e.currentPosition >= e.duration - HINT_END_OFFSET_MS) {
          finish();
        }
      });

      Sound.addPlaybackEndListener?.(() => {
        finish();
      });
    });
  } catch (e) {
    Sound.setVolume(1).catch(() => {});
  }
}
