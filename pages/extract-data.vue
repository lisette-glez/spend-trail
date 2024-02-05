<script setup lang="ts">
import type { Document } from "../types/document";
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const extractedData = ref<Document>();
const parsedData = ref<any>({});
const isLoading = ref(false);
const responseSuccess = ref(false);

const isUpload = ref(false);
const imgFile = ref("");
const imgPreview = ref("");
const activeTab = ref("device");
const errorAlert = ref(false);
const errorMessage = ref("");
const selectedType = ref("");
const uploadInput = ref<HTMLInputElement | null>(null);

function onChange(e: any) {
  if (e.files[0] && e.files[0].type.match("(jpeg|png|webp|heic|tiff)")) {
    const reader = new FileReader();
    reader.readAsDataURL(e.files[0]);
    reader.onload = (e: any) => {
      imgPreview.value = e.target!.result;
    };
    imgFile.value = e.files[0];
    isUpload.value = true;
    errorAlert.value = false;
  } else {
    imgFile.value = "";
    errorMessage.value =
      "File type not allowed. You can upload only jpg, png, webp, heic and tiff images.";
    errorAlert.value = true;
  }
}

async function uploadImage() {
  isLoading.value = true;
  const formData = new FormData();
  formData.append("document", imgFile.value);
  extractedData.value = await $fetch<Document>("/api/receipt", {
    method: "POST",
    body: formData,
  });
  try {
    if (extractedData.value.api_request.status_code == 201) {
      parsedData.value = renameKeys(
        extractedData.value.document.inference.prediction
      );
      isLoading.value = false;
      responseSuccess.value = true;
    } else {
      alert(extractedData.value.api_request.error.message);
      goBack();
    }
  } catch (error) {
    console.log(error);
  }
}

function getUrl(url: string) {
  imgFile.value = imgPreview.value = url;
  isUpload.value = true;
}

function getDocType(type: string) {
  selectedType.value = type;
  // switch (selectedType.value) {
  //   case "Invoice":
  //     docApiUrl.value = runtimeConfig.public.apiBaseInvoice;
  //     break;
  //   case "Expense Receipt":
  //     docApiUrl.value = runtimeConfig.public.apiBaseReceipt;
  //     break;
  //   case "Passport":
  //     docApiUrl.value = runtimeConfig.public.apiBasePassport;
  //     break;
  // }
  uploadImage();
}

function changeTab(tabName: string) {
  activeTab.value = tabName;
}

function goBack() {
  isUpload.value = false;
  responseSuccess.value = false;
  imgFile.value = "";
  imgPreview.value = "";
  extractedData.value = <Document>{};
  parsedData.value = {};
  selectedType.value = "";
  isLoading.value = false;
}

function triggerUpload() {
  uploadInput.value?.click();
}

async function saveData() {
  if (extractedData.value) {
    const dataToSave = extractedData.value.document.inference.prediction;
    const record: any = {
      user_id: user.value!.id,
      doc_type: dataToSave.document_type.value,
      purchase_date: dataToSave.date.value,
      category: dataToSave.category ? dataToSave.category.value : null,
      sub_category: dataToSave.subcategory
        ? dataToSave.subcategory.value
        : null,
      supplier_name: dataToSave.supplier_name.value,
      total_net: dataToSave.total_net.value,
      total_amount: dataToSave.total_amount.value,
      tip: dataToSave.tip ? dataToSave.tip.value : null,
      total_tax: dataToSave.total_tax ? dataToSave.total_tax.value : null,
      customer_address: dataToSave.customer_address
        ? dataToSave.customer_address.value
        : null,
      customer_name: dataToSave.customer_name
        ? dataToSave.customer_name.value
        : null,
      due_date: dataToSave.due_date
        ? new Date(dataToSave.due_date.value)
        : null,
      invoice_number: dataToSave.invoice_number
        ? dataToSave.invoice_number.value
        : null,
      supplier_address: dataToSave.supplier_address
        ? dataToSave.supplier_address.value
        : null,
    };

    const { data, error } = await supabase
      .from("documents")
      .insert(record)
      .select("id");

    if (error) {
      errorAlert.value = true;
      errorMessage.value = error.message;
      setTimeout(() => {
        errorAlert.value = false;
      }, 3500);
    } else {
      saveImgStorage(imgFile.value, data[0].id);
      alert("The data was saved successfully!");
    }
  }
}

async function saveImgStorage(file: any, id: string) {
  const { error } = await supabase.storage.from("receipts").upload(id, file);
  if (error) {
    errorAlert.value = true;
    errorMessage.value = error.message;
  } else {
    alert("The img was saved successfully!");
  }
}
</script>

<template>
  <AppAlert v-if="errorAlert" :errorMessage="errorMessage" />
  <div class="row justify-content-center" v-if="!isUpload">
    <div class="col-md-7">
      <div class="card custom-card px-5 pt-3 pb-5 shadow-sm border-0">
        <ul class="nav nav-tabs mb-4">
          <li class="nav-item cs-pointer" @click="changeTab('device')">
            <a class="nav-link" :class="{ active: activeTab == 'device' }"
              >Upload</a
            >
          </li>
          <li class="nav-item cs-pointer" @click="changeTab('link')">
            <a class="nav-link" :class="{ active: activeTab == 'link' }"
              >From URL</a
            >
          </li>
        </ul>
        <div
          v-if="activeTab == 'device' && !isUpload"
          class="uploader"
          @dragover.prevent
          @dragenter.prevent
          @dragstart.prevent
          @drop.prevent="onChange($event.dataTransfer)"
          :class="{ noPaddingTop: isUpload }"
        >
          <div class="file-input" v-if="!isUpload" @click="triggerUpload">
            <div for="file">
              <img
                src="~/assets/img/upload-img.png"
                class="img-fluid upload-image"
              />
              <input
                type="file"
                ref="uploadInput"
                @change="onChange($event.target)"
              />
            </div>
          </div>
          <div class="row justify-content-center">
            <div class="col-md-6">
              <p
                class="h6 upload-title"
                v-if="!isUpload"
                @click="triggerUpload"
              >
                Drag and drop an image here, or click to upload from your device
              </p>
            </div>
          </div>
        </div>
        <UploadByLink
          @typedUrl="getUrl"
          v-if="activeTab == 'link' && !isUpload"
        />
      </div>
    </div>
  </div>
  <div class="card custom-card p-4" v-if="isUpload">
    <div class="row justify-content-center">
      <div class="col-md-4">
        <ul
          class="nav nav-tabs justify-content-end mb-4"
          v-if="!responseSuccess"
        >
          <li
            class="nav-item cs-pointer"
            data-bs-toggle="modal"
            data-bs-target="#myModal"
          >
            <div class="nav-link">
              <i class="bi-upload pe-1"></i> Upload
              <span
                class="spinner-border text-primary spinner-border-sm ms-1"
                role="status"
                aria-hidden="true"
                v-if="isLoading"
              ></span>
            </div>
          </li>
          <li class="nav-item cs-pointer" @click="goBack">
            <div class="nav-link">
              <i class="bi-x-circle pe-1 text-danger"></i> Cancel
            </div>
          </li>
        </ul>
        <img :src="imgPreview" class="img-fluid py-3 px-2 preview-img w-100" />
      </div>
      <div class="col-md-8 extracted-data" v-if="responseSuccess">
        <h5 class="mb-3">
          EXTRACTED DATA FROM YOUR
          <span class="text-uppercase">{{ selectedType }}</span>
        </h5>
        <ul class="list-group rounded-0 d-flex flex-row flex-wrap">
          <template v-for="(text, key) in parsedData" :key="key">
            <div v-if="text.value != null" class="data-container">
              <div class="fw-bold key-name text-uppercase">{{ key }}</div>
              <li class="list-group-item mb-3">
                <div>{{ text.value }}</div>
              </li>
            </div>
          </template>
          <div
            class="data-container"
            v-if="selectedType == 'Invoice' && parsedData.taxes.length > 0"
          >
            <div class="fw-bold key-name text-uppercase">Taxes</div>
            <li
              class="list-group-item mb-3"
              v-for="(tax, index) in parsedData.taxes"
              :key="index"
            >
              <div>{{ tax.rate }}% - {{ tax.value }}</div>
            </li>
          </div>
          <div
            class="data-container"
            v-if="
              parsedData.reference_numbers &&
              parsedData.reference_numbers.length > 0
            "
          >
            <div class="fw-bold key-name">PO #</div>
            <li
              class="list-group-item mb-3"
              v-for="(reference, index) in parsedData.reference_numbers"
              :key="index"
            >
              <div>{{ reference.value }}</div>
            </li>
          </div>
          <div class="data-container" v-if="parsedData.locale">
            <div class="fw-bold key-name">CURRENCY</div>
            <li class="list-group-item">
              <div>{{ parsedData.locale.currency }}</div>
            </li>
          </div>
          <div
            class="data-container"
            v-if="
              selectedType == 'Passport' && parsedData.given_names.length > 0
            "
          >
            <div class="fw-bold key-name">GIVEN NAMES</div>
            <li
              class="list-group-item mb-3"
              v-for="(name, index) in parsedData.given_names"
              :key="index"
            >
              <div>{{ name.value }}</div>
            </li>
          </div>
        </ul>
        <ul
          class="list-group rounded-0"
          v-if="parsedData.line_items && parsedData.line_items.length > 0"
        >
          <div class="fw-bold key-name">LINE ITEMS</div>
          <li
            class="list-group-item mb-3"
            v-for="item in parsedData.line_items"
            :key="item.id"
          >
            <div>
              {{ item.quantity || 1 }}- {{ item.description }}
              <span v-if="item.unit_price">x {{ item.unit_price }}.00</span>
              -
              {{ item.total_amount }}
            </div>
          </li>
        </ul>
        <div class="text-end mt-5">
          <button type="button" class="btn btn-primary" @click="goBack">
            <i class="bi-arrow-left-short"></i> Go back
          </button>
          <button class="btn github-btn ms-3" type="button" @click="saveData">
            <i class="bi bi-save"></i>
            Save data
          </button>
        </div>
      </div>
    </div>
  </div>
  <DocTypeModal @selectedDocType="getDocType" />
</template>
