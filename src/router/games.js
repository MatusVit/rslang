import Index from "@/views/games/Index.vue";
import SpeakIt from "@/views/games/SpeakIt.vue";
// eslint-disable-next-line
import EnglishPuzzle from "@/views/games/EnglishPuzzle.vue";
import Savana from "@/views/games/Savana.vue";
import AudioCall from "@/views/games/AudioCall.vue";
import Sprint from "@/views/games/Sprint.vue";
import OurGame from "@/views/games/OurGame.vue";

export default [
  {
    path: "",
    component: Index,
  },
  {
    path: "speak-it",
    component: SpeakIt,
    meta: { title: 'Игра "SpeakIt"' },
  },
  {
    path: "english-puzzle",
    component: EnglishPuzzle,
    meta: { title: 'Игра "English puzzle"' },
  },
  {
    path: "savana",
    component: Savana,
    meta: { title: 'Игра "Саванна"' },
  },
  {
    path: "audio-call",
    component: AudioCall,
    meta: { title: 'Игра "Аудиовызов"' },
  },
  {
    path: "sprint",
    component: Sprint,
    meta: { title: 'Игра "Спринт"' },
  },
  {
    path: "our-game",
    component: OurGame,
    meta: { title: 'Игра "Своя игра"' },
  },
];