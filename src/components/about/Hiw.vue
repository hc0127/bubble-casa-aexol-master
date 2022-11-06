<template>
  <BasePopup class="hiw-popup">
    <iframe
      :width="videoWidth"
      height="316"
      :src="videoLink"
      title="YouTube video player"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>
  </BasePopup>
</template>

<script>
import BasePopup from "../common/BasePopup.vue";

export default {
  name: "Hiw",
  components: {
    BasePopup,
  },

  data() {
    return {
      current_view: "Hiw",
      videoLink: "https://www.youtube.com/embed/s7pFrQ_7xtg",
    };
  },

  methods: {
    closePopup() {
      store.triggerPopup(null);
    },
  },
  computed: {
    videoWidth() {
      return window.innerWidth > 650 ? 560 : window.innerWidth - 100;
    },
  },
};
</script>
