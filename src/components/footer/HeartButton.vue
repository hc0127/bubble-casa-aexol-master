<template>
  <BaseButton
    variant="flat"
    color="transparent"
    @click="handleClick"
    id="heartBtn"
  >
    <IconHeart />
    <div class="desc">Rate</div>
  </BaseButton>
</template>

<script>
import BaseButton from "../common/BaseButton.vue";
import IconHeart from "../icons/IconHeart.vue";

export default {
  name: "HeartButton",
  components: {
    IconHeart,
    BaseButton,
  },

  setup(_, { emit }) {
    const handleClick = () => {
      emit("click");
    };
    return {
      handleClick,
    };
  },
};
</script>
