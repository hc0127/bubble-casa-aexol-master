<template>
  <BasePopup class="logged-user" v-if="user">
    <h1 class="popup-title">{{ user.name }}</h1>
    <h1 class="popup-subtitle">{{ user.email }}</h1>
    <BaseButton @click="store.triggerPopup('ChangePassword')">
      Change password
    </BaseButton>
    <BaseButton
      v-if="userIsAuthor"
      class="logged-user__acp"
      @click="redirectAuthorPanel"
    >
      Go to Author Panel
    </BaseButton>
    <BaseButton
      v-if="!userIsAuthor && !userIsAdmin"
      class="logged-user__acp"
      @click="convertToAuthor"
    >
      Convert to author
    </BaseButton>
    <div class="hr" />
    <BaseButton @click="handleLogout">Log out</BaseButton>
    <BaseButton
      v-if="!userIsAdmin"
      class="logged-user__acp"
      color="red"
      @click="store.triggerPopup('DeleteUserConfirm')"
    >
      Delete account
    </BaseButton>
  </BasePopup>
</template>

<script>
import BasePopup from "../common/BasePopup.vue";
import IconEmail from "../icons/IconEmail.vue";
import { getRole, role_enum } from "../../enum/roleEnum.js";
import { logout, user_session } from "../../session";
import { computed, onMounted } from "vue";
import { ref } from "@vue/reactivity";
import BaseButton from "../common/BaseButton.vue";
import store from "../../store.js";
import { callApi } from "../../api/callApi";

export default {
  name: "logged-user-info",
  components: {
    BaseButton,
    IconEmail,
    BasePopup,
    getRole,
    user_session,
  },
  setup() {
    const user = ref(null);

    onMounted(() => {
      user.value = user_session.value.session;
    });

    const userIsAuthor = computed(() => {
      return user?.value.role_id === role_enum.author;
    });

    const userIsAdmin = computed(() => {
      return user?.value.role_id === role_enum.admin;
    });

    const handleLogout = () => {
      logout();
      store.triggerPopup(null);
    };

    const redirectAuthorPanel = () => {
      window.open(`https://acp.library.one/`, "_blank");
    };

    const convertToAuthor = () => {
      const userId = user?.value?.user_id;
      callApi("user", "convertRole", { id: userId, role_id: 2 }).then(() =>
        window.location.reload()
      );
      store.triggerPopup(null);
    };
    return {
      user,
      userIsAuthor,
      logout,
      handleLogout,
      redirectAuthorPanel,
      store,
      convertToAuthor,
      userIsAdmin,
    };
  },
};
</script>
