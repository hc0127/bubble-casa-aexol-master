<template>
  <div class="user" v-if="userIconHandler">
    <BaseButton v-if="!user_session" @click="() => triggerPopup('SignIn')">
      Sign in
    </BaseButton>
    <IconUserCircle v-else @click="() => triggerPopup('LoggedUserInfo')" />
  </div>
</template>

<script>
import store from "../../store.js";
import { user_session } from "../../session";
import IconUserCircle from "../icons/IconUserCircle.vue";
import BaseButton from "../common/BaseButton.vue";
import { computed } from "vue";
import { useRoute } from "vue-router";

export default {
  name: "UserButton",
  components: {
    BaseButton,
    IconUserCircle,
  },
  setup() {
    const triggerPopup = (name) => {
      store.triggerPopup(name);
    };

    const route = useRoute();

    const userIconHandler = computed(() => {
      const screenWidth = window.innerWidth;
      const path = route.path;

      if (path.includes("articleList") && screenWidth < 960) {
        return false;
      }
      return true;
    });

    return {
      triggerPopup,
      user_session,
      userIconHandler,
    };
  },
};
</script>
