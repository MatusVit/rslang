<template>
  <div class="promo">
    <v-row align="center" justify="center">
      <v-col class="text-center" style="position: relative;">
        <div class="bg">
          <Emblem />
        </div>
        <h1 class="promo__header">ENGLISH PUZZLE</h1>
        <p class="promo__title">
          Нажимайте на слова, собирайте фразы. Слова можно перетаскивать. Выберите необходимые
          подсказки в меню.
        </p>
        <v-btn
          class="promo__button"
          large
          color="primary"
          @click="$router.push('/games/english-puzzle')"
          >Начать игру</v-btn
        >
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Emblem from "@/components/common/Emblem.vue";

export default {
  components: {
    Emblem,
  },
};
</script>

<style lang="scss" scoped>
.text-center {
  position: relative;
  margin-top: 50%;
  @media (min-width: 375px) {
    margin-top: 40%;
  }
  @media (min-width: 600px) {
    margin-top: 25%;
  }
  @media (min-width: 960px) {
    margin-top: 15%;
  }
  @media (min-width: 1904px) {
    margin-top: 10%;
  }
}
.bg {
  position: absolute;
  top: -50px;
  left: 0;
  right: 0;
  width: 100%;
}
.promo__header {
  font-style: normal;
  font-weight: 300;
  font-size: 55px;
  line-height: 64px;
  @media (min-width: 375px) {
    font-size: 60px;
    line-height: 72px;
  }
  @media (min-width: 600px) {
    font-size: 73px;
    line-height: 85px;
  }
  @media (min-width: 960px) {
    font-size: 96px;
    line-height: 112px;
  }
}
.promo__title {
  max-width: 900px;
  margin: 0 auto;
  margin-bottom: 0;
  font-size: 15px;
  line-height: 18px;
  text-align: center;
  @media (min-width: 375px) {
    font-size: 17px;
    line-height: 21px;
  }
  @media (min-width: 600px) {
    margin-bottom: 18px;
    font-size: 20px;
    line-height: 24px;
  }
  @media (min-width: 960px) {
    margin-bottom: 24px;
    font-size: 24px;
    line-height: 36px;
  }
}
.promo__button {
  margin: 24px;
  @media (max-width: 600px) {
    font-size: 0.75rem !important;
    height: 28px !important;
    min-width: 50px !important;
    padding: 0 12.4444444444px !important;
  }
}
</style>
