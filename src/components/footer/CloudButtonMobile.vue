<template>
  <BaseButton
    variant="flat"
    color="transparent"
    @click="handleClick"
    id="cloudBtn"
  >
    <IconUploadMobile
      :class="{ 'disabled-opacity': !is_allowed_to_post || checkUserIsBlocked }"
    />
    <div class="desc">Upload</div>
  </BaseButton>
</template>

<script>
import BaseButton from "../common/BaseButton.vue";
import IconUploadMobile from "../icons/IconUploadMobile.vue";
import { callApi } from "../../api/callApi";
import { ref } from "@vue/reactivity";
import store from "../../store.js";
import { onMounted, computed } from "vue";
import { user_session } from "../../session";
import { role_enum } from "../../enum/roleEnum";

export default {
  name: "CloudButtonMobile",
  components: {
    IconUploadMobile,
    BaseButton,
  },

  props: {
    id: Number,
  },

  setup(props) {
    const is_allowed_to_post = ref();
    const is_user_blocked = ref(false);

    const checkIsAllowed = async () => {
      const res = await callApi("node", "getPathForNode", {
        node_id: props.id,
      });
      const currentNode = res.result.find(({ id }) => id === props.id);
      is_allowed_to_post.value = currentNode.allow_to_post === 1;
    };

    const checkUserIsBlocked = computed(() => {
      if (user_session.value) {
        return user_session.value.session.status == 2 ? true : false;
      }
    });
    const handleClick = () => {
      if (checkUserIsBlocked.value) {
        store.triggerPopup("PopupAccountIsBlocked");
        return;
      } else {
        store.triggerPopup("UploadLink");
      }
      if (!user_session.value) {
        return store.triggerPopup("SignIn");
      }
      switch (user_session.value.session.role_id) {
        case role_enum.user:
          return store.triggerPopup("PopupSignInAsAuthor");
        case role_enum.author:
        case role_enum.admin:
          return !is_allowed_to_post.value
            ? store.triggerPopup("PopupNotAllowedToAdd")
            : store.triggerPopup("UploadLink");
        default:
          break;
      }
    };

    onMounted(() => {
      checkIsAllowed();
    });

    return {
      handleClick,
      user_session,
      is_allowed_to_post,
      checkUserIsBlocked,
      is_user_blocked,
    };
  },
};
</script>
