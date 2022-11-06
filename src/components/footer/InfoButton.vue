<template>
  <BaseTooltip :message="`id: ${active_id}`">
    <BaseButton variant="flat" color="transparent" id="infoBtn">
      <IconInfo />
      <div class="desc">info</div>
    </BaseButton>
  </BaseTooltip>
</template>

<script>
import BaseButton from "../common/BaseButton.vue";
import BaseTooltip from "../common/BaseTooltip.vue";
import IconInfo from "../icons/IconInfo.vue";
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import { ref } from "@vue/reactivity";

export default {
  name: "InfoButton",
  components: {
    IconInfo,
    BaseTooltip,
    BaseButton,
  },
  setup() {
    const route = useRoute();
    const active_id = ref();

    onMounted(() => {
      active_id.value = route.params.id;
    });
    return {
      active_id,
    };
  },
};
</script>
