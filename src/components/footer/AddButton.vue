<template>
  <BaseButton
    :disabled="disabled"
    :loading="loading"
    :titleVisible="titleVisible"
    variant="flat"
    color="transparent"
    id="addBtn"
  >
    <IconMinusSecound v-if="is_favourite" />
    <SecoundIconAdd v-else />
    <div class="desc" v-if="titleVisible">Bookmark</div>
  </BaseButton>
</template>

<script>
import SecoundIconAdd from "../icons/SecoundIconAdd.vue";
import IconMinusSecound from "../icons/IconMinusSecound.vue";
import BaseButton from "../common/BaseButton.vue";

export default {
  name: "AddButton",
  components: {
    IconMinusSecound,
    BaseButton,
    SecoundIconAdd,
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
