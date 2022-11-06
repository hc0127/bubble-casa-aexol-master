<template>
  <BaseButton
    variant="flat"
    color="transparent"
    @click="handleBack"
    id="backBtnMobile"
  >
    <IconShareBigMobile />
    <div class="desc">Back</div>
  </BaseButton>
</template>

<script>
import BaseButton from "../common/BaseButton.vue";
import IconShareBigMobile from "../icons/IconShareBigMobile.vue";
import { useRouter } from "vue-router";

export default {
  name: "MobileBackButton",
  components: {
    IconShareBigMobile,
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
