<template>
  <BasePopup class="install-popup">
    <div class="img"><img :src="getImage" @click="installRedirect" /></div>

    <div class="or">or</div>
    <div class="desc">Add to your Home Screen:</div>
    <div class="desc">1. Tap Share icon</div>
    <div class="desc">2. Click Add to Home Screen</div>
  </BasePopup>
</template>

<script>
import BasePopup from "../common/BasePopup.vue";
import AppStore from "../../asset/images/appstore.png";

export default {
  name: "Install",
  components: {
    BasePopup,
  },

  data() {
    return {};
  },

  methods: {
    closePopup() {
      store.triggerPopup(null);
    },
    installRedirect() {
      window.open("https://a.com/", "_blank");
    },
  },
  computed: {
    getImage() {
      return AppStore;
    },
  },
};
</script>
