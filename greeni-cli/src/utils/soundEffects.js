import Sound from "react-native-nitro-sound";
import { Image } from "react-native";

// BackButton
const backButtonSound = Image.resolveAssetSource(
  require("../assets/sounds/effects/back_button.mp3"),
);

export async function playBackButtonSound() {
  try {
    await Sound.stopPlayer().catch(() => {});
    Sound.removePlayBackListener?.();

    await Sound.startPlayer(backButtonSound.uri);

    Sound.addPlayBackListener(e => {
      if (e.currentPosition >= e.duration) {
        Sound.stopPlayer()
          .catch(() => {})
          .finally(() => {
            Sound.removePlayBackListener?.();
          });
      }
    });
  } catch (e) {
    if (__DEV__) {
      console.log("PLAY BACK BUTTON SOUND FAIL:", e);
    }
  }
}

// Button
const buttonSound = Image.resolveAssetSource(require("../assets/sounds/effects/button.mp3"));

export async function playButtonSound() {
  try {
    await Sound.stopPlayer().catch(() => {});
    Sound.removePlayBackListener?.();

    await Sound.startPlayer(buttonSound.uri);

    Sound.addPlayBackListener(e => {
      if (e.currentPosition >= e.duration) {
        Sound.stopPlayer()
          .catch(() => {})
          .finally(() => {
            Sound.removePlayBackListener?.();
          });
      }
    });
  } catch (e) {
    if (__DEV__) {
      console.log("PLAY BUTTON SOUND FAIL:", e);
    }
  }
}

// Correct / Wrong
// Correct / Wrong
const correctSound = Image.resolveAssetSource(require("../assets/sounds/effects/correct.mp3"));

const wrongSound = Image.resolveAssetSource(require("../assets/sounds/effects/wrong.mp3"));

async function playEffectSound(uri, label) {
  try {
    await Sound.stopPlayer().catch(() => {});
    Sound.removePlayBackListener?.();

    await Sound.startPlayer(uri);

    Sound.addPlayBackListener(e => {
      if (e.currentPosition >= e.duration) {
        Sound.stopPlayer()
          .catch(() => {})
          .finally(() => {
            Sound.removePlayBackListener?.();
          });
      }
    });
  } catch (e) {
    if (__DEV__) {
      console.log(`${label} FAIL:`, e);
    }
  }
}

export function playCorrectSound() {
  return playEffectSound(correctSound.uri, "PLAY CORRECT SOUND");
}

export function playWrongSound() {
  return playEffectSound(wrongSound.uri, "PLAY WRONG SOUND");
}

// Hint
const hintSound = Image.resolveAssetSource(require("../assets/sounds/effects/hint.mp3"));

export async function playHintSound() {
  try {
    await Sound.stopPlayer().catch(() => {});
    Sound.removePlayBackListener?.();

    await Sound.startPlayer(hintSound.uri);

    return await new Promise(resolve => {
      Sound.addPlayBackListener(e => {
        if (e.duration > 0 && e.currentPosition >= e.duration) {
          Sound.stopPlayer()
            .catch(() => {})
            .finally(() => {
              Sound.removePlayBackListener?.();
              resolve(true);
            });
        }
      });
    });
  } catch (e) {
    if (__DEV__) {
      console.log("PLAY HINT SOUND FAIL:", e);
    }
  }
}
