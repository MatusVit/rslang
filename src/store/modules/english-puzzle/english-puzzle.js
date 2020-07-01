import words from "./words";
import statistics from "./statistics";

export default {
  modules: {
    words,
    statistics,
  },
  state: {
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
    },
    isUserChangedRound: false,
    sourceCards: [],
    resultsCards: [],
  },
  mutations: {
    updateSettingsEP(state, options) {
      state.settingsEP = options;
      localStorage.setItem("englishPuzzleSettings", JSON.stringify(options));
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
    updateRoundsPerLevelCountEP(state, value) {
      state.settingsEP.roundsInLevelCount = value;
    },
  },
  actions: {
    setSettingsEP({ commit }, options) {
      commit("updateSettingsEP", options);
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
    getSettingsEP(state) {
      return state.settingsEP;
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
