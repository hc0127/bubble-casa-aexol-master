<template>
  <BaseButton
    :disabled="disabled"
    :loading="loading"
    :titleVisible="titleVisible"
    variant="flat"
    color="transparent"
    id="addBtn"
  >
    <IconMinus v-if="is_favourite" />
    <IconAdd v-else />
    <div class="desc" v-if="titleVisible">Bookmark</div>
  </BaseButton>
</template>

<script>
import IconAdd from "../icons/IconAdd.vue";
import IconMinus from "../icons/IconMinus.vue";
import BaseButton from "../common/BaseButton.vue";

export default {
  name: "AddButton",
  components: {
    IconMinus,
    BaseButton,
    IconAdd,
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
