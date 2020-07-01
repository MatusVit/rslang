<template>
  <v-row
    align="center"
    justify="center"
    class="fill-height text-sm-body-2 text-md-body-1 text-lg-subtitle-1"
  >
    <GameStatistics
      :isShowGameStatistics="isShowGameStatistics"
      v-on:closeGameStatistics="isShowGameStatistics = false"
    />
    <v-card
      class="game-content text-center"
      dark
      flat
      color="transparent"
      max-width="800"
      min-width="290"
    >
      <v-card class="pt-4 pb-4" color="transparent" flat :class="{ invisible: isEndRound }">
        <v-btn
          icon
          @click="audio.play(AUDIO_URL)"
          :disabled="audio.isAudioActive"
          :class="{ invisible: !isShowAudioHint, active: audio.isAudioActive }"
        >
          <v-icon large v-if="audio.isAudioActive">mdi-volume-high</v-icon>
          <v-icon large v-else>mdi-volume-low</v-icon>
        </v-btn>
        <v-card-title
          class="hint-translation text-center text-sm-body-1 text-md-subtitle-1 text-lg-h6"
          :class="{ invisible: !showTranslate }"
        >
          {{ translateText }}
        </v-card-title>
        <v-speed-dial
          absolute
          right
          top
          direction="bottom"
          v-model="fab"
          open-on-hover
          class="game-btn-settings"
        >
          <template v-slot:activator>
            <v-btn v-model="fab" color="blue darken-2" dark fab>
              <v-icon v-if="fab">mdi-close</v-icon>
              <v-icon v-else>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
          <v-btn fab dark small color="indigo" @click.stop="isShowSettings = true">
            <v-icon>mdi-cog-outline</v-icon>
          </v-btn>
          <v-btn fab dark small color="green" @click.stop="isShowGameStatistics = true">
            <v-icon>mdi-chart-bar</v-icon>
          </v-btn>
        </v-speed-dial>
        <Settings :isShowSettings="isShowSettings" v-on:closeSettings="isShowSettings = false" />
      </v-card>
      <Results
        :isPhraseCollected="isPhraseCollected"
        :arrayOfCardsOfCompletedRounds="arrayOfCardsOfCompletedRounds"
        :painting="painting"
        :isEndRound="isEndRound"
        v-on:transferCard="transferCardFromResultsToSources"
      />
      <v-card flat color="transparent" min-height="50" width="800" class="mt-4 mb-4">
        <Source
          :isEndRound="isEndRound"
          :painting="painting"
          v-on:transferCard="transferCardFromSourcesToResults"
          v-on:setWidthCard="setWidthCard"
          v-if="!isEndRound"
        />
        <PaintingInformation :painting="painting" v-else />
      </v-card>
      <RoundStatistics
        :painting="painting"
        :isShowResultsRound="isShowResultsRound"
        :roundResults="roundResults"
        v-on:closeRoundStatistics="isShowResultsRound = false"
        v-on:continueGame="continueGame"
        v-on:openGameStatistics="isShowGameStatistics = true"
      />
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn v-if="isHelpButtonAccessibility" color="primary" @click="showSkipPhrasePuzzle">
          I don't know
        </v-btn>
        <v-btn v-if="isCheckButtonAccessibility" color="primary" @click="checkResult">
          Check
        </v-btn>
        <v-btn v-if="isPhraseCollected" color="primary" @click="continueGame">
          Continue
        </v-btn>
        <v-btn v-if="isEndRound" color="primary" @click="openRoundStatistics">
          Results
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-row>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Source from "@/components/games/EnglishPuzzle/Source.vue";
import Results from "@/components/games/EnglishPuzzle/Results/Results.vue";
import PaintingInformation from "@/components/games/EnglishPuzzle/PaintingInformation.vue";
import Settings from "@/components/games/EnglishPuzzle/Settings.vue";
import RoundStatistics from "@/components/games/EnglishPuzzle/RoundStatistics.vue";
import GameStatistics from "@/components/games/EnglishPuzzle/GameStatistics.vue";
import Card from "@/helpers/english-puzzle/card";
import RoundResults from "@/helpers/english-puzzle/round-results";
import Painting from "@/helpers/english-puzzle/paintings";
import AudioControl from "@/helpers/english-puzzle/audio-control";
import StatisticsItem from "@/helpers/english-puzzle/statistics-item";

export default {
  components: {
    Results,
    Source,
    PaintingInformation,
    Settings,
    RoundStatistics,
    GameStatistics,
  },
  data() {
    return {
      MAX_NUM_PHRASES_ROUND: 10,
      currentPhraseNumber: 0,
      isPhraseCollected: false,
      isErrors: false,
      arrayOfCardsOfCompletedRounds: [],
      isEndRound: false,
      AUDIO_URL: "",
      translateText: "",
      audio: {},
      painting: {},
      isShowSettings: false,
      roundResults: {},
      isShowResultsRound: false,
      isShowGameStatistics: false,
      fab: false,
    };
  },
  computed: {
    ...mapGetters([
      "getWordsForRoundEP",
      "getOptionsEP",
      "getHintOptionsEP",
      "getSourceCardsEP",
      "getResultsCardsEP",
      "getIsUserChangedRoundEP",
      "getStatisticsEP",
    ]),
    isAllСardsInResults() {
      return this.getResultsCardsEP.length === this.getPhrase().length;
    },
    isHelpButtonAccessibility() {
      return (
        (!this.isAllСardsInResults && !this.isEndRound) ||
        (this.isAllСardsInResults && this.isErrors && !this.isPhraseCollected)
      );
    },
    isCheckButtonAccessibility() {
      return this.isAllСardsInResults && !this.isPhraseCollected;
    },
    showTranslate() {
      return this.getHintOptionsEP.showTranslation || this.isPhraseCollected;
    },
    isShowAudioHint() {
      return this.getHintOptionsEP.showAudio || this.isPhraseCollected;
    },
  },
  watch: {
    getIsUserChangedRoundEP() {
      if (this.getIsUserChangedRoundEP) this.startNewRound();
    },
  },
  mounted() {
    this.audio = new AudioControl();
    this.startNewRound();
    this.updateStatisticsEPFromLocaleStorage();
  },
  methods: {
    ...mapActions([
      "fetchWordsForRoundEP",
      "setOptionsEP",
      "setSourceCardsEP",
      "setResultsCardsEP",
      "fetchRoundsPerLevelCountEP",
      "setIsUserChangedRoundEP",
      "setStatisticsEP",
    ]),
    startNewRound() {
      this.roundResults = new RoundResults();
      this.arrayOfCardsOfCompletedRounds = [];
      this.currentPhraseNumber = 0;
      this.clearGameState();
      this.fetchWordsForRoundEP(this.getOptionsEP)
        .then(() => {
          setTimeout(() => {
            this.startNewPhrasePuzzle();
            this.setRoundPainting();
            this.setIsUserChangedRoundEP(false);
          }, 0);
        })
        .catch((err) => {
          this.showAlert("error", "Error", err.message);
        });
    },
    startNewPhrasePuzzle() {
      const phrase = this.getPhrase();
      this.setCards(phrase);
      this.setAudioUrl();
      this.setTranslate();
      if (this.getHintOptionsEP.autoPlayAudio) this.audio.play(this.AUDIO_URL);
    },
    clearGameState() {
      this.setResultsCardsEP([]);
      this.setSourceCardsEP([]);
      this.isPhraseCollected = false;
      this.isErrors = false;
      this.isEndRound = false;
      this.audio.stop();
      this.AUDIO_URL = "";
    },
    goToNextRound() {
      const options = { ...this.getOptionsEP };
      if (options.page === options.numOfPagesInGroup) {
        if (options.group === options.numOfGroups) return false;
        options.group += 1;
        this.fetchRoundsPerLevelCountEP(options.group)
          .then((num) => {
            options.numOfPagesInGroup = num;
            options.page = 0;
          })
          .catch((err) => {
            this.showAlert("error", "Error", err.message);
          });
      } else {
        options.page += 1;
      }
      this.setOptionsEP(options);
      this.startNewRound();
      return true;
    },
    continueGame() {
      if (!this.isEndRound) this.arrayOfCardsOfCompletedRounds.push(this.getPhrase());
      if (this.arrayOfCardsOfCompletedRounds.length === this.MAX_NUM_PHRASES_ROUND) {
        this.finishRound();
      } else {
        this.clearGameState();
        if (this.currentPhraseNumber + 1 === this.MAX_NUM_PHRASES_ROUND) {
          this.goToNextRound();
        } else {
          this.currentPhraseNumber += 1;
          setTimeout(() => {
            this.startNewPhrasePuzzle();
          }, 0);
        }
      }
    },
    finishRound() {
      this.isEndRound = true;
      this.arrayOfCardsOfCompletedRounds = [];
      this.audio.stop();
      this.audio.isAudioActive = false;
      this.updateStatisticsEP();
    },
    updateStatisticsEP() {
      const statisticsItem = new StatisticsItem(
        this.getOptionsEP.group,
        this.getOptionsEP.page,
        this.roundResults.getWordsId()
      );
      const statisticsArray = [...this.getStatisticsEP];
      statisticsArray.push(statisticsItem);
      this.setStatisticsEP(statisticsArray);
      localStorage.setItem("englishPuzzleStatistics", JSON.stringify(statisticsArray));
    },
    updateStatisticsEPFromLocaleStorage() {
      const statisticsArray = localStorage.getItem("englishPuzzleStatistics");
      if (statisticsArray) this.setStatisticsEP(JSON.parse(statisticsArray));
    },
    showSkipPhrasePuzzle() {
      this.roundResults.skip = this.getWordsForRoundEP[this.currentPhraseNumber];
      const phrase = this.getPhrase();
      const newCards = phrase.map((item, index) => new Card(item, index, true));
      this.setResultsCardsEP(newCards);
      this.setSourceCardsEP([]);
      this.isPhraseCollected = true;
      this.audio.play(this.AUDIO_URL);
    },
    getPhrase() {
      const phrase = this.getWordsForRoundEP[this.currentPhraseNumber].textExample;
      return phrase.split(" ").map((item) => item.replace(/<\/?[^>]+>/g, ""));
    },
    setCards(phrase) {
      const mixed = [...phrase].sort(() => Math.random() - 0.5);
      const newCards = mixed.map((item, index) => new Card(item, index, false));
      this.setSourceCardsEP(newCards);
    },
    setAudioUrl() {
      const url = this.getWordsForRoundEP[this.currentPhraseNumber].audioExample;
      this.AUDIO_URL = url;
    },
    setTranslate() {
      this.translateText = this.getWordsForRoundEP[this.currentPhraseNumber].textExampleTranslate;
    },
    setRoundPainting() {
      const { group, page } = this.getOptionsEP;
      const newPainting = new Painting(group, page);
      this.painting = newPainting.getPainting();
    },
    checkResult() {
      let error;
      const sourcePhrase = this.getPhrase();
      const newCards = this.getResultsCardsEP.map((el, index) => {
        const item = el;
        item.isCheck = true;
        if (item.word !== sourcePhrase[index]) {
          item.isError = true;
          error = true;
        } else {
          item.isError = false;
        }
        return item;
      });
      this.setResultsCardsEP(newCards);
      if (error) {
        this.isErrors = true;
      } else {
        this.roundResults.success = this.getWordsForRoundEP[this.currentPhraseNumber];
        this.isPhraseCollected = true;
        this.audio.play(this.AUDIO_URL);
      }
    },
    transferCardFromSourcesToResults(id) {
      const source = this.getSourceCardsEP.slice();
      const result = this.getResultsCardsEP.slice();
      const target = source.findIndex((item) => item.id === id);
      result.push(source.splice(target, 1)[0]);
      this.setSourceCardsEP(source);
      this.setResultsCardsEP(result);
    },
    transferCardFromResultsToSources(id) {
      let target;
      const source = this.getSourceCardsEP.slice();
      const result = this.getResultsCardsEP.slice();
      result.forEach((el, index) => {
        const item = el;
        item.isCheck = false;
        item.isError = false;
        if (item.id === id) target = index;
      });
      if (id !== null) source.push(result.splice(target, 1)[0]);
      source.sort((a, b) => a.id - b.id);
      this.setSourceCardsEP(source);
      this.setResultsCardsEP(result);
      this.isErrors = false;
    },
    setWidthCard(value) {
      const newCards = this.getSourceCardsEP.map((el) => {
        const item = el;
        if (item.id === value.id) {
          item.width = value.width;
        }
        return item;
      });
      this.setSourceCardsEP(newCards);
    },
    openRoundStatistics() {
      this.audio.stop();
      this.isShowResultsRound = true;
    },
    showAlert(type, title, text) {
      this.$notify({
        group: "main",
        type,
        title,
        text,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.game-content {
  width: 290px;
  @media (min-width: 340px) {
    width: auto;
  }
}
.game-btn-settings {
  top: -10px !important;
}
.hint-translation {
  box-sizing: content-box;
  justify-content: center;
  word-break: normal;
  min-height: 3.5em;
}
</style>