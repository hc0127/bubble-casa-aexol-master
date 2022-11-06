<template>
  <BasePopup class="delete-user" v-if="user">
    <h1 class="popup-title">Are you sure you want delete your account?</h1>
    <div class="menu">
      <BaseButton @click="deleteAccount">Yes</BaseButton>
      <BaseButton @click="cancelDelete">No</BaseButton>
    </div>
  </BasePopup>
</template>

<script>
import BasePopup from "../common/BasePopup.vue";
import { logout, user_session } from "../../session";
import { onMounted } from "vue";
import { ref } from "@vue/reactivity";
import BaseButton from "../common/BaseButton.vue";
import store from "../../store.js";
import { callApi } from "../../api/callApi";

export default {
  name: "delete-user-confirm",
  components: {
    BaseButton,
    BasePopup,
    user_session,
  },
  setup(props, { emit }) {
    const user = ref(null);

    onMounted(() => {
      user.value = user_session.value.session;
    });

    const deleteAccount = () => {
      const userId = user?.value?.user_id;
      callApi("user", "deleteUser", { id: userId });
      store.triggerPopup(null);
    };

    const cancelDelete = () => {
      store.triggerPopup(null);
    };

    return {
      user,
      logout,
      store,
      deleteAccount,
      cancelDelete,
    };
  },
};
</script>
