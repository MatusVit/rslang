import words from "./words";
import statistics from "./statistics";

export default {
  modules: {
    words,
    statistics,
  },
  state: {
<<<<<<< HEAD
    hintOptions: {
      showTranslation: true,
      showAudio: true,
      autoPlayAudio: true,
=======
    settingsEP: {
      level: 0,
      round: [0, 0, 0, 0, 0, 0],
      roundsInLevelCount: 0,
      levelCount: 5,
      hints: {
        translation: true,
        showBackground: true,
        speak: true,
        speakAuto: true,
      },
>>>>>>> develop
    },
    isUserChangedRound: false,
    sourceCards: [],
    resultsCards: [],
  },
  mutations: {
<<<<<<< HEAD
    updateHintOptionsEP(state, options) {
      state.hintOptions = options;
=======
    updateSettingsEP(state, options) {
      state.settingsEP = options;
>>>>>>> develop
    },
    updateIsUserChangedRoundEP(state, value) {
      state.isUserChangedRound = value;
    },
    updateSourceCardsEP(state, value) {
      state.sourceCards = value;
    },
    updateResultsCardsEP(state, value) {
      state.resultsCards = value;
    },
<<<<<<< HEAD
  },
  actions: {
    setHintOptionsEP({ commit }, options) {
      commit("updateHintOptionsEP", options);
=======
    updateRoundsPerLevelCountEP(state, value) {
      state.settingsEP.roundsInLevelCount = value;
    },
  },
  actions: {
    setSettingsEP({ commit, dispatch }, options) {
      commit("updateSettingsEP", options);
      dispatch("setUserSettingsEpRootState", options);
    },
    async downloadSettingsEP({ commit, dispatch, rootState }) {
      await dispatch("downloadSettings");
      const { optional } = rootState.userSettings;
      commit("updateSettingsEP", optional.gamePuzzle);
    },
    setUserSettingsEpRootState({ commit, dispatch, rootState }, options) {
      const { userSettings } = rootState;
      userSettings.optional.gamePuzzle = options;
      commit("setUserSettings", userSettings);
      dispatch("uploadSettings");
>>>>>>> develop
    },
    setIsUserChangedRoundEP({ commit }, value) {
      commit("updateIsUserChangedRoundEP", value);
    },
    setSourceCardsEP({ commit }, value) {
      const cards = value.map((el) => {
        const item = el;
        item.isCheck = false;
        item.isError = false;
        item.isResults = false;
        return item;
      });
      commit("updateSourceCardsEP", cards);
    },
    setResultsCardsEP({ commit }, value) {
      const cards = value.map((el) => {
        const item = el;
        item.init = false;
        item.isResults = true;
        return item;
      });
      commit("updateResultsCardsEP", cards);
    },
  },
  getters: {
<<<<<<< HEAD
    getHintOptionsEP(state) {
      return state.hintOptions;
=======
    getSettingsEP(state) {
      return state.settingsEP;
>>>>>>> develop
    },
    getIsUserChangedRoundEP(state) {
      return state.isUserChangedRound;
    },
    getSourceCardsEP(state) {
      return state.sourceCards;
    },
    getResultsCardsEP(state) {
      return state.resultsCards;
    },
  },
};
