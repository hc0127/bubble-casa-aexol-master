<template>
  <BaseButton
    :disabled="disabled"
    :loading="loading"
    :titleVisible="titleVisible"
    variant="flat"
    color="transparent"
    id="addBtn"
  >
    <IconMinusMobile v-if="is_favourite" />
    <IconAddMobile v-else />
    <div class="desc" v-if="titleVisible">Bookmark</div>
  </BaseButton>
</template>

<script>
import IconAddMobile from "../icons/IconAddMobile.vue";
import IconMinusMobile from "../icons/IconMinusMobile.vue";
import BaseButton from "../common/BaseButton.vue";

export default {
  name: "MobileAddButton",
  components: {
    IconMinusMobile,
    BaseButton,
    IconAddMobile,
  },
  props: {
    is_favourite: {
      type: Boolean,
    },
    loading: {
      type: Boolean,
    },
    disabled: {
      type: Boolean,
    },
    titleVisible: {
      type: Boolean,
    },
  },
};
</script>
