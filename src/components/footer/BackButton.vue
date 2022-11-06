<template>
  <BaseButton
    variant="flat"
    color="transparent"
    @click="handleBack"
    id="backBtn"
  >
    <IconShareBig />
    <div class="desc">Back</div>
  </BaseButton>
</template>

<script>
import BaseButton from "../common/BaseButton.vue";
import IconShareBig from "../icons/IconShareBig.vue";
import { useRouter } from "vue-router";

export default {
  name: "BackButton",
  components: {
    IconShareBig,
    BaseButton,
  },
  setup() {
    const router = useRouter();
    const handleBack = () => {
      router.go(-1);
    };

    return { handleBack };
  },
};
</script>
