<template>
  <div class="header" :class="{ 'transparent-header': transparent }">
    <div class="header__left">
      <div class="logo">
        <img
          src="../../asset/images/logo.png"
          class="link"
          @click.prevent="handleRoute"
          alt="Library logo"
        />
        <transition name="fade">
          <LogoReadMe v-if="transparent && itsSearchBubble" />
        </transition>
      </div>
      <p v-if="transparent && itsSearchBubble" class="logo-description">
        - A link sharing platform for Experts
      </p>
      <slot name="left-side"></slot>
    </div>
    <div class="header__right">
      <slot name="right-side"></slot>
      <UserButton />
    </div>
  </div>
</template>

<script>
import store from "../../store.js";
import { user_session } from "../../session";
import IconUserCircle from "../icons/IconUserCircle.vue";
import LogoSvg from "../Logo/LogoSvg.vue";
import LogoReadMe from "../Logo/LogoReadMe.vue";
import { useRouter } from "vue-router";
import UserButton from "./UserButton.vue";

export default {
  name: "Header",
  props: {
    transparent: {
      type: Boolean,
      default: false,
    },
    itsSearchBubble: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    UserButton,
    LogoReadMe,
    LogoSvg,
    IconUserCircle,
  },

  setup(props, { emit }) {
    const router = useRouter();

    const triggerPopup = (name) => {
      store.triggerPopup(name);
    };

    const handleRoute = () => {
      router.push({ path: "/" }).then(() => {
        document.location.reload();
      });
      emit("goHome", 0);
    };

    return {
      triggerPopup,
      user_session,
      handleRoute,
    };
  },
};
</script>
