<template>
  <BaseButton
    variant="flat"
    color="transparent"
    @click="handleHome"
    id="homeBtn"
  >
    <IconHome />
    <div class="desc">Home</div>
  </BaseButton>
</template>

<script>
import BaseButton from "../common/BaseButton.vue";
import IconHome from "../icons/IconHome.vue";
import { useRouter } from "vue-router";

export default {
  name: "HomeButton",
  components: {
    IconHome,
    BaseButton,
  },

  setup() {
    const router = useRouter();

    const handleHome = () => {
      router.push({ path: "/" });
    };

    return { handleHome };
  },
};
</script>

