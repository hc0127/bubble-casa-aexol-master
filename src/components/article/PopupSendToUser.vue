<template>
  <BasePopup class="send-to-user">
    <h1 class="send-to-user__title popup-title">Share with your friend</h1>
    <div class="send-to-user__text">
      <p>Please enter Nick of Library.one user.</p>
    </div>
    <BaseInput v-model="name" label="Nick" placeholder="User" type="text">
      <IconEnvelope />
    </BaseInput>
    <BaseButton :loading="loading" @click="handleSent">
      Send article
    </BaseButton>
  </BasePopup>
</template>

<script>
import BaseButton from "../common/BaseButton.vue";
import IconEnvelope from "../icons/IconEnvelope.vue";
import BaseInput from "../common/BaseInput.vue";
import BasePopup from "../common/BasePopup.vue";
import { ref } from "@vue/reactivity";
import { useFetch } from "../../hooks/useFetch";
import { callApi } from "../../api/callApi";
import { notify } from "@kyvg/vue3-notification";

export default {
  name: "SendToUser",
  components: {
    BaseButton,
    IconEnvelope,
    BaseInput,
    BasePopup,
  },

  props: {
    article_id: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },

  setup({ article_id }, { emit }) {
    const name = ref("");

    const { loading, fetchData } = useFetch();

    const handleSent = async () => {
      const res = await fetchData(() =>
        callApi("favourite-article", "sendTo", {
          name: name.value,
          article_id,
        })
      );
      if (res.success) {
        notify({
          type: "success",
          title: "Your article was successfully sent.",
        });
      }
      emit("close");
    };

    return {
      name,
      loading,
      handleSent,
    };
  },
};
</script>
