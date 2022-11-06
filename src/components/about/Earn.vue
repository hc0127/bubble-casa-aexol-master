<template>
  <BasePopup class="earn-popup">
    <div class="content">
      <div class="title">
        <p>Are you an Expert in your field? - Earn with Library.one</p>
      </div>
      <p class="single">1. Register as Author.</p>
      <p class="single">2. Upload 200 links ( English only ).</p>
      <p class="single">
        3. Ask moderator@library.one to grant you Expert status.
      </p>
      <p class="single">
        4. After verification from the moderator, you will earn 1 coin for each
        newly uploaded link.
      </p>
      <p class="single">5. Change coins to cash or premium features.</p>
    </div>
  </BasePopup>
</template>

<script>
import BasePopup from "../common/BasePopup.vue";

export default {
  name: "Earn",
  components: {
    BasePopup,
  },

  data() {
    return {
      current_view: "Earn",
    };
  },

  methods: {
    closePopup() {
      store.triggerPopup(null);
    },
  },
};
</script>
