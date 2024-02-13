<script setup lang="ts">
import type { Document } from "../types/document";
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const extractedData = ref<Document | null>(null);
const parsedData = ref<any>({});
const isLoading = ref(false);
const responseSuccess = ref(false);
const imgFile = ref<File | string>("");
const imgPreview = ref("");

const isUpload = ref(false);

const activeTab = ref("device");
const errorAlert = ref(false);
const errorMessage = ref("");
const selectedType = ref("");
const uploadInput = ref<HTMLInputElement | null>(null);

function onChange(event: Event) {
  const files =
    event.type == "change"
      ? (event.target as HTMLInputElement).files
      : (event as DragEvent).dataTransfer!.files;

  if (files && files![0].type.match("(jpeg|png|webp|heic|tiff)")) {
    const reader = new FileReader();
    reader.readAsDataURL(files![0]);
    reader.onload = (e) => {
      imgPreview.value = (e.target as FileReader).result as string;
    };
    imgFile.value = files![0];
    isUpload.value = true;
    errorAlert.value = false;
  } else {
    imgFile.value = "";
    errorMessage.value =
      "File type not allowed. You can upload only jpg, png, webp, heic and tiff images.";
    errorAlert.value = true;
  }
}

function getDocType(type: string) {
  selectedType.value = type;
  isLoading.value = true;
  if (selectedType.value == "Expense Receipt") {
    processData("/api/receipt");
  } else if (selectedType.value == "Invoice") {
    processData("/api/invoice");
  } else {
    alert("No document type selected");
  }
}

async function processData(apiUrl: string) {
  try {
    if (!imgFile.value) return;
    const formData = new FormData();
    formData.append("document", imgFile.value);
    extractedData.value = await $fetch<Document>(apiUrl, {
      method: "POST",
      body: formData,
    });
    displayData();
  } catch (error) {
    console.log(error);
    alert("An error occurred while processing the file");
  }
}

function displayData() {
  if (
    extractedData.value &&
    extractedData.value.api_request.status_code == 201
  ) {
    parsedData.value = renameKeys(
      extractedData.value!.document.inference.prediction
    );
    isLoading.value = false;
    responseSuccess.value = true;
  } else {
    alert(
      extractedData.value
        ? extractedData.value.api_request.error.message
        : "An error occurred processing the data"
    );
    goBack();
  }
}

function getUrl(url: string) {
  imgFile.value = imgPreview.value = url;
  isUpload.value = true;
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
    <div class="col-md-9 col-lg-6">
      <div class="card custom-card px-4 px-md-5 pt-3 pb-5 shadow-sm border-0">
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
          @drop.prevent="onChange($event)"
          :class="{ noPaddingTop: isUpload }"
        >
          <div class="file-input" v-if="!isUpload" @click="triggerUpload">
            <div for="file">
              <img src="/upload-img.png" class="img-fluid upload-image" />
              <input type="file" ref="uploadInput" @change="onChange($event)" />
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
        <PreviewImage
          :preview="imgPreview"
          :success="responseSuccess"
          :loading="isLoading"
          @clearData="goBack"
        />
      </div>
      <div class="col-md-8 extracted-data" v-if="responseSuccess">
        <DisplayData :data="parsedData" :docType="selectedType" />
        <div class="text-end mt-5">
          <button type="button" class="btn btn-primary" @click="goBack">
            <i class="bi-arrow-left-short"></i> Go back
          </button>
          <button class="btn github-btn ms-3" type="button" @click="saveData">
            <i class="bi bi-database"></i>
            Save data
          </button>
        </div>
      </div>
    </div>
  </div>
  <DocTypeModal @selectedDocType="getDocType" />
</template>
