<template>
  <div class="header__link">
    <div
      v-if="!user_session"
      class="header-button"
      @click.prevent="() => handleClick('about')"
    >
      <div class="header__link--become">Become an author</div>
    </div>
    <div
      class="header-button earn-button"
      v-if="!user_session"
      @click.prevent="() => handleClick('earn')"
    >
      <div class="header__link--library">Earn With Library.one</div>
    </div>
    <div
      class="header-button"
      v-if="!user_session"
      @click.prevent="() => handleClick('hiw')"
    >
      <div class="header__link--hiw">How it Works</div>
    </div>
    <div class="header-button app-button" v-if="!isStandalone">
      <div class="header__link--hiw" @click="installApp">
        <IconDownload />App
      </div>
    </div>
    <div class="header-button nodes-button">
      <div class="header__link--counter-button">
        <div class="counter">{{ nodesCounter }}</div>
        <div class="">Nodes</div>
      </div>
    </div>
    <div class="header-button articles-button">
      <div class="header__link--counter-button"
        @click="articleList"
      >
        <div class="counter">{{ articlesCounter }}</div>
        <div class="">Articles</div>
      </div>
    </div>
  </div>
</template>

<script>
import store from "../../store.js";
import LogoSvg from "./LogoSvg.vue";
import IconArrowLeft from "../icons/IconArrowLeft.vue";
import { is_author } from "../../session";
import { ref } from "vue";
import IconDownload from "../icons/IconDownload.vue";
import { user_session } from "../../session";
import { callApi } from "../../api/callApi";

export default {
  name: "LogoReadMe",
  components: { IconArrowLeft, LogoSvg, IconDownload },
  setup() {
    const handleClick = (link) => {
      store.triggerPopup(link);
    };

    const articleList = () => {
      window.open("https://library.one/articleList/1/?advanced=advanced", "_blank");
    };

    const articlesCounter = ref(null);
    const nodesCounter = ref(null);

    return {
      handleClick,
      articleList,
      is_author,
      articlesCounter,
      nodesCounter,
      user_session,
    };
  },
  data: () => ({
    deferredPrompt: null,
  }),
  created() {
    this.captureEvent();
  },
  computed: {
    isIos() {
      return (
        [
          "iPad Simulator",
          "iPhone Simulator",
          "iPod Simulator",
          "iPad",
          "iPhone",
          "iPod",
        ].includes(navigator.platform) ||
        // iPad on iOS 13 detection
        (navigator.userAgent.includes("Mac") && "ontouchend" in document)
      );
    },
    isStandalone() {
      return window.matchMedia("(display-mode: standalone)").matches;
    },
  },
  methods: {
    installApp() {
      if (this.isIos) {
        store.triggerPopup("install");
      } else {
        this.clickCallback();
      }
    },
    captureEvent() {
      window.addEventListener("beforeinstallprompt", (e) => {
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault();
        // Stash the event so it can be triggered later.
        this.deferredPrompt = e;
      });
    },

    clickCallback() {
      // Show the prompt
      this.deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      this.deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          // Add analyticcs event
          this.$gtag.event("add_to_home_screen");
        }
        this.deferredPrompt = null;
      });
    },
  },
  async mounted() {
    const articles = await callApi("article", "articleCount");
    this.articlesCounter = articles.count * 2;

    const nodes = await callApi("node", "nodeCount");
    this.nodesCounter = nodes.count;
  },
};
</script>

