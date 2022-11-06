<template>
  <BasePopup class="upload-link">
    <h1 class="upload-link__title popup-title">Upload link to article</h1>
    <div class="scroll">
      <div class="upload-link__form-wrapper">
        <BaseInput
          v-model="body.iframe"
          :error="error.iframe"
          label="Paste link"
          placeholder="https://"
          type="text"
          @blur="validate('iframe')"
        />
        <BaseButton
          :disabled="fetchBtnDisabled"
          :loading="loading_fetch"
          @click="getDataFromUrl()"
        >
          Fetch
        </BaseButton>
      </div>
      <BaseCheckBox v-model="body.is_owner" class="ownership" numeric>
        I declare ownership of copyrights
      </BaseCheckBox>
      <BaseInput
        v-model="body.title"
        :error="error.title"
        label="Enter title:"
        placeholder="Title"
        type="text"
        @blur="validate('title')"
      />
      <BaseTextarea
        v-model="body.description"
        label="Description"
        placeholder="Description {keyword1, keyword2,...}"
        :maxlength="maxDescription"
      />
      <div class="tldr-wrapper">
        <BaseTextarea
          v-model="body.tldr"
          label="TL;DR"
          placeholder="TL;DR"
          class="tldr"
          :maxlength="maxTldr"
        />
        <div class="more" @click="openMoreModal">More Pages</div>
      </div>
      <div class="upload-link__box">
        <div class="upload-link__button-wrapper">
          <div class="upload-link__thumbnail">
            <img v-if="fileName" :src="body.image" />
            <BaseButton v-else color="transparent" variant="flat">
              <input
                id="file-input"
                accept=".jpg, .jpeg, .png, .gif"
                type="file"
                @input="handleInput"
              />
              <IconUploadThumb />
              <div class="upload-link__btn-text">Upload thumbnail</div>
            </BaseButton>
          </div>
          <div class="upload-link__relations-container">
            <BaseButton
              variant="flat"
              @click="() => triggerPopup('ManageRelations')"
            >
              <IconNetwork />
              Relations
            </BaseButton>
            <div class="upload-link__file-name">
              <span v-if="fileName">
                <IconClose @click="handleRemoveFile" />
                <span>{{ fileName }}</span>
              </span>
              <div v-if="error.image" class="upload-link__error-wrapper">
                <span class="upload-link__error">{{ error.image }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <BaseSectionTitle title="Or use our editor" />
      <BaseButton disabled>
        <IconUseEditor />
        Use editor
      </BaseButton>
      <div class="upload-link__checkbox-wrapper">
        <BaseTooltip
          message="This option is possible only if your site can be opened in Iframe. If you are not sure, do not check"
          variant="small"
        >
          <BaseCheckBox
            v-model="body.is_link"
            :disabled="!body.is_owner"
            numeric
          >
            Link (Open in new tab)
          </BaseCheckBox>
        </BaseTooltip>
        <BaseCheckBox v-model="body.is_commercial" numeric
          >Commercial/Advertising</BaseCheckBox
        >
        <BaseCheckBox v-model="body.is_delay_day" numeric>Podcast</BaseCheckBox>
        <BaseCheckBox v-model="body.is_video" numeric>Video</BaseCheckBox>
        <BaseCheckBox v-model="body.is_translate" disabled numeric
          >Translate</BaseCheckBox
        >
        <BaseCheckBox v-model="body.is_exclusive" numeric
          >Exclusive</BaseCheckBox
        >
      </div>
      <div :class="{ invisible: body.is_commercial }" class="info">
        By uploading the link you declare it is <u>not strictly commercial</u>
      </div>
      <BaseButton
        :disabled="is_error"
        :loading="loading"
        @click="handleAddArticle"
      >
        Upload
      </BaseButton>

      <!-- more popup  -->
    </div>
    <div class="more-popup" v-if="more">
      <div class="buttons">
        <div
          :class="{ active: activePage === page.value }"
          v-for="page in pagesDefault"
          :key="page"
          @click="activePageHandler(page.value)"
        >
          <div class="page-button">{{ page.label }}</div>
        </div>
        <div
          class="page-add-button"
          @click="addPage"
          v-if="pagesDefault.length < 5"
        >
          +
        </div>
        <div class="delete-page" @click="deletePage">Delete this page</div>
      </div>
      <div class="content-wrapper">
        <div
          class="img-wrapper"
          v-if="activeFields[activePage - 2].activeFields.field_1"
        >
          <div class="close-more-icon">
            <IconClose @click="handleRemoveMoreField(1)" />
          </div>
          <div class="upload-link__box">
            <div class="upload-link__button-wrapper">
              <div class="upload-link__thumbnail">
                <img
                  v-if="
                    body.pages[activePage - 2].images.length == 1 ||
                    body.pages[activePage - 2].images.length == 2
                  "
                  :src="body.pages[activePage - 2].images[0]"
                />
                <BaseButton v-else color="transparent" variant="flat">
                  <input
                    id="file-input"
                    accept=".jpg, .jpeg, .png, .gif"
                    type="file"
                    @input="handleInputPagesImage"
                  />
                  <div class="upload-info">
                    <div class="upload-link__btn-text">Upload image</div>
                    <div class="upload-link__btn-text">650x500px</div>
                    <div class="upload-link__btn-text-small">(max.500kb)</div>
                  </div>
                </BaseButton>
              </div>
            </div>
          </div>
        </div>
        <div
          class="img-wrapper"
          v-if="activeFields[activePage - 2].activeFields.field_2"
        >
          <div class="close-more-icon">
            <IconClose @click="handleRemoveMoreField(2)" />
          </div>
          <div class="upload-link__box">
            <div class="upload-link__button-wrapper">
              <div class="upload-link__thumbnail">
                <img
                  v-if="
                    activeFields[activePage - 2].activeFields.field_1
                      ? body.pages[activePage - 2].images.length == 2
                      : body.pages[activePage - 2].images.length == 1
                  "
                  :src="
                    activeFields[activePage - 2].activeFields.field_1
                      ? body.pages[activePage - 2].images[1]
                      : body.pages[activePage - 2].images[0]
                  "
                />
                <BaseButton v-else color="transparent" variant="flat">
                  <input
                    id="file-input"
                    accept=".jpg, .jpeg, .png, .gif"
                    type="file"
                    @input="handleInputPagesImage"
                  />
                  <div class="upload-info">
                    <div class="upload-link__btn-text">Upload image</div>
                    <div class="upload-link__btn-text">650x500px</div>
                    <div class="upload-link__btn-text-small">(max.500kb)</div>
                  </div>
                </BaseButton>
              </div>
            </div>
          </div>
        </div>
        <div
          style="display: flex; align-items: center; margin-right: 20px"
          v-if="
            !activeFields[activePage - 2].activeFields.field_1 ||
            !activeFields[activePage - 2].activeFields.field_2
          "
        >
          <IconAddMobile @click="handleAddMoreField" />
        </div>
        <BaseTextarea
          label="Description"
          placeholder="Description {keyword1, keyword2,...}"
          v-model="body.pages[activePage - 2].description"
          style="width: 100%"
        />
      </div>
      <div class="save-wrapper">
        <p @click="closeMoreModal" class="cancel-cta">Cancel</p>
        <p @click="save" class="save-cta">Save</p>
      </div>
    </div>
  </BasePopup>
</template>
<!--//todo: find a better place to include those styles-->
<style src="@vueform/multiselect/themes/default.css"></style>
<script>
import Multiselect from "@vueform/multiselect";
import store from "../../store.js";
import BasePopup from "../common/BasePopup.vue";
import BaseInput from "../common/BaseInput.vue";
import BaseButton from "../common/BaseButton.vue";
import IconUploadThumb from "../icons/IconUploadThumb.vue";
import IconNetwork from "../icons/IconNetwork.vue";
import BaseSectionTitle from "../common/BaseSectionTitle.vue";
import IconUseEditor from "../icons/IconUseEditor.vue";
import BaseCheckBox from "../common/BaseCheckBox.vue";
import BaseTextarea from "../common/BaseTextarea.vue";
import { callApi } from "../../api/callApi.js";
import { useRoute } from "vue-router";
import { clearOffset, getArticleList } from "./articleData.js";
import BaseTooltip from "../common/BaseTooltip.vue";
import useValidator from "../../validator/validator.js";
import { computed, ref } from "@vue/reactivity";
import { onMounted } from "vue";
import { notify } from "@kyvg/vue3-notification";
import IconClose from "../icons/IconClose.vue";
import { useFetch } from "../../hooks/useFetch";
import IconArrowLeft from "../icons/IconArrowLeft.vue";
import IconAddMobile from "../icons/IconAddMobile.vue";

export default {
  name: "upload-link",
  components: {
    IconClose,
    BaseTooltip,
    BaseTextarea,
    BaseCheckBox,
    IconUseEditor,
    BaseSectionTitle,
    IconNetwork,
    IconUploadThumb,
    BaseButton,
    BaseInput,
    BasePopup,
    Multiselect,
    IconArrowLeft,
    IconAddMobile,
  },
  setup() {
    const route = useRoute();
    const options = ref(null);
    const more = ref(false);
    const pagesDefault = ref([{ label: "page 2", value: 2 }]);
    const maxDescription = ref(400);
    const maxTldr = ref(700);

    const body = ref({
      pages: null,
      title: "",
      description: "",
      tldr: "",
      iframe: "",
      images: [],
      language: "en",
      is_owner: 0,
      is_commercial: 0,
      is_delay_day: 0,
      is_delay_week: 0,
      is_exclusive: 0,
      is_link: 1,
      is_translate: 0,
      is_video: 0,
      node_id: +route.params.id,
    });

    const fileName = ref(null);

    const activePage = ref(2);

    const activeFields = ref([
      { page: 2, activeFields: { field_1: true, field_2: true } },
    ]);

    const pageFileName = ref(null);
    // const pageFileNameSecound = ref(null);

    const { validateNow, validate, error, is_error } = useValidator(
      body,
      "article",
      "create"
    );
    const { loading, loading_fetch, fetchData } = useFetch();

    const fetchBtnDisabled = computed(
      () =>
        !body.value.iframe.length > 0 ||
        body.value.title.length > 0 ||
        body.value.description.length > 0
    );

    const sizeLimit = 5000000;

    const handleInput = (file) => {
      const img = file.target.files[0];
      if (img.size > sizeLimit) {
        notify({
          title: "Maximum file size can not exceed 5MB",
          type: "error",
        });
        return;
      }
      fileName.value = img.name;
      createBase64FromImage(img);
    };

    const createBase64FromImage = (img) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        body.value.image = e.target.result;
      };

      reader.readAsDataURL(img);
    };

    const handleInputPagesImage = (file) => {
      const img = file.target.files[0];
      if (img.size > sizeLimit) {
        notify({
          title: "Maximum file size can not exceed 5MB",
          type: "error",
        });
        return;
      }
      pageFileName.value = img.name;
      createBase64FromPagesImage(img);
    };

    const createBase64FromPagesImage = (img) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        body.value.pages[activePage.value - 2].images.push(e.target.result);
      };

      reader.readAsDataURL(img);
    };

    const handleRemoveFile = () => {
      fileName.value = null;
      body.value.image = null;
    };

    const triggerPopup = (name) => {
      store.triggerPopup(name);
    };

    const handleAddArticle = async () => {
      if (validateNow()) {
        const res = await fetchData(() =>
          callApi("article", "create", body.value)
        );
        if (res.success) {
          store.triggerPopup(null);
          // TODO: czarny box z żółtym napisem
          notify({
            title: "Success",
            type: "success",
          });
          clearOffset();
          await getArticleList();
        }
      }
    };

    const activePageHandler = (val) => {
      activePage.value = val;
    };

    const getDataFromUrl = async () => {
      const res = await fetchData(
        () =>
          callApi("article", "getDataFromLink", { iframe: body.value.iframe }),
        "fetch"
      );
      if (res.success) {
        var description = res.description?.substring(0, maxDescription.value);
        var tldr = res.tldr?.substring(0, maxTldr.value);

        if (res.description.length > maxDescription.value) {
          description = description.concat("...");
        }

        if (res.tldr?.length > maxTldr.value) {
          tldr = tldr.concat("...");
        }

        body.value.is_video = res.is_video;
        body.value.title = res.title;
        body.value.description = description;
        body.value.tldr = tldr;
        body.value.image = res.image;
        if (res.image) {
          fileName.value = "File uploaded from source";
        }
        body.value.pages = null;
      }
      validateNow();
    };

    const openMoreModal = () => {
      if (body.value.pages == null) {
        body.value.pages = [{ description: "", page_number: 2, images: [] }];
      }
      more.value = !more.value;
    };

    const closeMoreModal = () => {
      body.value.pages = null;
      more.value = !more.value;
      activePage.value = 2;
      pagesDefault.value = [{ label: "page 2", value: 2 }];
    };

    const save = () => {
      more.value = !more.value;
    };

    const addPage = () => {
      if (pagesDefault.value.length > 4) return;
      const addPageNumber = pagesDefault.value.slice(-1)[0].value + 1;
      pagesDefault.value.push({
        label: `page ${addPageNumber}`,
        value: addPageNumber,
      });
      activeFields.value.push({
        page: addPageNumber,
        activeFields: { field_1: true, field_2: true },
      });
      activePage.value = addPageNumber;
      body.value.pages?.push({
        description: "",
        page_number: activePage.value,
        images: [],
      });
    };

    const deletePage = () => {
      if (pagesDefault.value.length < 2) return;
      const itemToDelete = pagesDefault.value.length - 1;
      pagesDefault.value.splice(itemToDelete, 1);
      activeFields.value.splice(itemToDelete, 1);
      pagesDefault.value.length === 2;
      activePage.value = pagesDefault.value.length + 1;
      body.value.pages?.splice(itemToDelete, 1);
    };

    const handleRemoveMoreField = (img) => {
      if (img === 1) {
        activeFields.value[activePage.value - 2].activeFields.field_1 = false;
        if (body.value.pages[activePage.value - 2].images.length > 0) {
          body.value.pages[activePage.value - 2].images.splice(0, 1);
        }
        return;
      } else {
        activeFields.value[activePage.value - 2].activeFields.field_2 = false;
        if (!activeFields.value[activePage.value - 2].activeFields.field_1) {
          body.value.pages[activePage.value - 2].images.splice(0, 1);
          return;
        }
        if (body.value.pages[activePage.value - 2].images.length > 1) {
          body.value.pages[activePage.value - 2].images.splice(1, 1);
        }
        return;
      }
    };

    const handleAddMoreField = () => {
      if (!activeFields.value[activePage.value - 2].activeFields.field_1) {
        activeFields.value[activePage.value - 2].activeFields.field_1 = true;
        return;
      }
      if (!activeFields.value[activePage.value - 2].activeFields.field_2) {
        activeFields.value[activePage.value - 2].activeFields.field_2 = true;
        return;
      }
    };

    onMounted(async () => {
      const res = await callApi("settings", "getLanguages");
      if (res.success) {
        options.value = res.lang_list.sort((a, b) =>
          a.label > b.label ? 1 : -1
        );
      }
      const lang = localStorage.getItem("setLang");
      if (lang) {
        body.value.language = lang;
      } else body.value.language = "en";
    });

    return {
      handleInput,
      handleAddArticle,
      triggerPopup,
      options,
      validateNow,
      validate,
      error,
      is_error,
      fileName,
      handleRemoveFile,
      loading,
      loading_fetch,
      getDataFromUrl,
      fetchBtnDisabled,
      openMoreModal,
      more,
      pagesDefault,
      addPage,
      body,
      closeMoreModal,
      handleInputPagesImage,
      activePage,
      pageFileName,
      activePageHandler,
      save,
      deletePage,
      handleRemoveMoreField,
      activeFields,
      handleAddMoreField,
      maxDescription,
      maxTldr,
    };
  },
};
</script>

<style scoped>
.active {
  border-bottom: 1px solid black;
}
</style>
