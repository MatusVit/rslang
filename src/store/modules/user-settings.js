import errorList from "@/config/errors";

export default {
  state: {
    wordsPerDay: 20,
    optional: {
      globalSettings: {
        maxCards: 50,
        answerBtn: false,
        deleteBtn: false,
        btnDifficult: false,
        btnSet: false,
      },
      wordsTraining: {
        wordTranslate: false,
        textMeaning: false,
        textExample: false,
        transcription: false,
        image: false,
      },
      gameSpeakIt: {
        round: [0, 0, 0, 0, 0, 0],
        level: 0,
      },
      gamePuzzle: {
        round: [0, 0, 0, 0, 0, 0],
        level: 0,
        roundsInLevelCount: 0,
        levelCount: 5,
        hints: {
          translation: true,
          showBackground: true,
          speak: true,
          speakAuto: true,
        },
      },
      gameSavannah: {
        round: [0, 0, 0, 0, 0, 0],
        level: 0,
      },
      gameAuidioCall: {
        round: [0, 0, 0, 0, 0, 0],
        level: 0,
      },
      gameSprint: {
        round: [0, 0, 0, 0, 0, 0],
        level: 0,
      },
      gameOwnGame: {
        level: 0,
        round: [0, 0, 0, 0, 0, 0],
        roundsInLevelCount: 59,
        levelCount: 5,
        audio: true,
        complexity: 0,
        learned: false,
      },
    },
  },
  actions: {
    async uploadSettings({ state, dispatch }) {
      try {
        const user = await dispatch("getUser");
        if (!user) throw Error(errorList.unauthorized);
        const { wordsPerDay, optional } = state;
        const res = await fetch(
          `https://afternoon-falls-25894.herokuapp.com/users/${user.userId}/settings`,
          {
            method: "PUT",
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${user.token}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ wordsPerDay, optional }),
          }
        );
        if (!res.ok) throw Error(`${res.status} (${res.statusText})`);
      } catch (err) {
        dispatch("setError", err.message);
      }
    },
    async downloadSettings({ dispatch, commit }) {
      try {
        const user = await dispatch("getUser");
        if (!user) throw Error(errorList.unauthorized);
        const res = await fetch(
          `https://afternoon-falls-25894.herokuapp.com/users/${user.userId}/settings`,
          {
            method: "GET",
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${user.token}`,
              Accept: "application/json",
            },
          }
        );
        if (res.ok) {
          const { wordsPerDay, optional } = await res.json();
          if (optional !== undefined && Object.keys(optional).length !== 0) {
            commit("setUserSettings", { wordsPerDay, optional });
          } else {
            this.dispatch("uploadSettings");
          }
        } else if (res.status === 404) {
          this.dispatch("uploadSettings");
        }
      } catch (err) {
        dispatch("setError", err.message);
      }
    },
    setGameSetting({ commit }, { gameName, gameSettings }) {
      commit("setGameSetting", { gameName, gameSettings });
      this.dispatch("uploadSettings");
    },
  },
  mutations: {
    setUserSettings(state, { wordsPerDay, optional }) {
      state.wordsPerDay = wordsPerDay;
      state.optional = optional;
    },
    setGameSetting(state, { gameName, gameSettings }) {
      state.optional[gameName] = gameSettings;
    },
  },
  getters: {
    getSavannahSettings(state) {
      return state.optional.gameSavannah;
    },
  },
};
