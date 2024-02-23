<script setup lang="ts">
import type { Document } from "../types/document";
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const extractedData = ref<Document | null>(null);
const parsedData = ref<any>({});
const isLoading = ref(false);
const responseSuccess = ref(false);
const activeTab = ref("device");
const selectedType = ref("");

const uploaded = ref(false);
const preview = ref("");
const imageFile = ref();
const errorMessage = ref("");
const imageUrl = ref("/api/receipt");

function getUploadData(isUpload: boolean, imgFile: File, message: string) {
  uploaded.value = isUpload;
  imageFile.value = imgFile;
  errorMessage.value = message;
}

function getDocType(type: string) {
  selectedType.value = type;
  isLoading.value = true;
  if (selectedType.value == "Expense Receipt") {
    imageUrl.value = "/api/receipt";
  } else {
    imageUrl.value = "/api/invoice";
  }
  responseSuccess.value = true;
}

function getUrl(url: string) {
  imageFile.value = preview.value = url;
  uploaded.value = true;
}

function changeTab(tabName: string) {
  activeTab.value = tabName;
}

function goBack() {
  uploaded.value = false;
  responseSuccess.value = false;
  imageFile.value = "";
  preview.value = "";
  extractedData.value = <Document>{};
  parsedData.value = {};
  selectedType.value = "";
  isLoading.value = false;
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
      errorMessage.value = error.message;
      setTimeout(() => {
        errorMessage.value = "";
      }, 3500);
    } else {
      saveImgStorage(imageFile.value, data[0].id);
      alert("The data was saved successfully!");
    }
  }
}

async function saveImgStorage(file: any, id: string) {
  const { error } = await supabase.storage.from("receipts").upload(id, file);
  if (error) {
    errorMessage.value = error.message;
  } else {
    alert("The img was saved successfully!");
  }
}
</script>

<template>
  <AppAlert v-if="errorMessage" :errorMessage="errorMessage" />
  <div class="row justify-content-center" v-if="!uploaded">
    <div class="col-md-9 col-lg-7">
      <div class="card main-card px-4 px-md-5 pt-3 pb-5 shadow-sm border-0">
        <ul class="nav nav-tabs mb-4">
          <li class="nav-item cs-pointer" @click="changeTab('device')">
            <NuxtLink
              class="nav-link"
              :class="{ active: activeTab == 'device' }"
              >Upload</NuxtLink
            >
          </li>
          <li class="nav-item cs-pointer" @click="changeTab('link')">
            <NuxtLink class="nav-link" :class="{ active: activeTab == 'link' }"
              >From URL</NuxtLink
            >
          </li>
        </ul>
        <UploadImage
          v-if="activeTab == 'device' && !uploaded"
          @uploadImage="getUploadData"
        />
        <UploadByLink
          @typedUrl="getUrl"
          v-if="activeTab == 'link' && !uploaded"
        />
      </div>
    </div>
  </div>
  <div class="row justify-content-center" v-if="uploaded && !responseSuccess">
    <div class="col-md-9 col-lg-6">
      <div class="card main-card p-4">
        <PreviewImage
          :file="imageFile"
          :success="responseSuccess"
          :loading="isLoading"
          @clearData="goBack"
        />
      </div>
    </div>
  </div>
  <div class="card main-card p-4" v-if="responseSuccess">
    <div class="row justify-content-center">
      <div class="col-lg-4 mt-1 mb-5">
        <PreviewImage
          :file="imageFile"
          :success="responseSuccess"
          :loading="isLoading"
          @clearData="goBack"
        />
        <div class="text-center mt-4">
          <button
            type="button"
            class="btn regular-btn text-light mt-2"
            @click="goBack"
          >
            <i class="bi-arrow-left-short"></i> Go back
          </button>
          <button
            class="btn green-btn text-light ms-3 mt-2"
            type="button"
            @click="saveData"
          >
            <i class="bi bi-database"></i>
            Save data
          </button>
        </div>
      </div>
      <div class="col-lg-8">
        <div class="extracted-data">
          <DisplayData
            :file="imageFile"
            :url="imageUrl"
            :docType="selectedType"
          />
        </div>
      </div>
    </div>
  </div>
  <DocTypeModal @selectedDocType="getDocType" />
</template>
