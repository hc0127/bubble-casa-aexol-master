<template>
  <BaseButton variant="flat" color="transparent" disabled id="tbBtn">
    <IconT />
    <div class="desc">Translate</div>
  </BaseButton>
</template>

<script>
import BaseButton from "../common/BaseButton.vue";
import IconT from "../icons/IconT.vue";

export default {
  name: "TButton",
  components: {
    IconT,
    BaseButton,
  },
};
</script>
