<template>
  <BaseButton disabled variant="flat" color="transparent" id="networkBtn">
    <IconNetwork />
    <div class="desc">Relations</div>
  </BaseButton>
</template>

<script>
import BaseButton from "../common/BaseButton.vue";
import IconNetwork from "../icons/IconNetwork.vue";

export default {
  name: "NetworkButton",
  components: {
    IconNetwork,
    BaseButton,
  },
};
</script>
