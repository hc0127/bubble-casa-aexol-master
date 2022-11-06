<template>
  <main v-if="app_is_ready">
    <PwaCompoennt />
    <div class="scroll">
      <router-view></router-view>
    </div>
  </main>
  <component v-if="componentName" :is="componentName" :useProps="false" />
  <notifications position="bottom right" />
</template>
<script>
import { defineAsyncComponent, onMounted, ref } from "vue";
import { defineComponent } from "vue";
import store from "./store";
import SignIn from "./components/auth/SignIn.vue";
import SignUpUser from "./components/auth/SignUpUser.vue";
import SignUpAuthor from "./components/auth/SignUpAuthor.vue";
import ForgetPassword from "./components/auth/ForgetPassword.vue";
import EmailSent from "./components/auth/EmailSent.vue";
import LoggedUserInfo from "./components/auth/LoggedUserInfo.vue";
import DeleteUserConfirm from "./components/auth/DeleteUserConfirm.vue";
import About from "./components/about/About.vue";
import Earn from "./components/about/Earn.vue";
import Hiw from "./components/about/Hiw.vue";
import Install from "./components/Logo/Install.vue";
import ChangePassword from "./components/auth/ChangePassword.vue";
import UploadLink from "./components/article/UploadLink.vue";
import ManageRelations from "./components/article/ManageRelations.vue";
import PopupSignInAsAuthor from "./components/article/PopupSignInAsAuthor.vue";
import PopupNotAllowedToAdd from "./components/article/PopupNotAllowedToAdd.vue";
import PopupAccountIsBlocked from "./components/article/PopupAccountIsBlocked.vue";
import { setConfig, setErrorList } from "./api/callApi";
import { me } from "./session";
import Topbar from "./components/header/Header.vue";
import PasswordChanged from "./components/auth/PasswordChanged.vue";
import PwaComponent from "./components/PwaComponent.vue";

export default defineComponent({
  name: "App",
  components: {
    Topbar,
    SignIn,
    SignUpUser,
    SignUpAuthor,
    ForgetPassword,
    EmailSent,
    LoggedUserInfo,
    DeleteUserConfirm,
    ChangePassword,
    About,
    Earn,
    Hiw,
    Install,
    UploadLink,
    ManageRelations,
    PasswordChanged,
    PopupSignInAsAuthor,
    PopupNotAllowedToAdd,
    PopupAccountIsBlocked,
    PwaComponent,
  },
  setup() {
    const app_is_ready = ref(false);

    const AsyncComponent = defineAsyncComponent(() => {
      import(`./components/Auth/${store.getState().popup}.vue`);
    });

    onMounted(async () => {
      await setConfig();
      await setErrorList();
      await me();
      app_is_ready.value = true;
    });

    return {
      app_is_ready,
      componentName: store.getState().popup,
    };
  },
});
</script>

