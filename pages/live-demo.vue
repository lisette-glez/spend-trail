<script setup lang="ts">
import type { Document } from "../types/document";
const imgUrl = ref(useRuntimeConfig().public.receiptImgUrl);
const imgFile = ref<File | string>("");
const extractedData = ref<Document | null>(null);
const parsedData = ref<any>({});
const previewImg = ref("b7ba9396-0d51-4e1a-a5db-9f6bdf613d5c");
const loading = ref(false);
const activeImg = ref("Receipt");

onMounted(() => {
  processImage("/api/receipt");
});

const { data } = useAsyncData("demoData", async () => {
  const imageData = await useProcessData(props.url, props.file);
  const parsedData: any = useRenameKeys(
    imageData!.document.inference.prediction
  );
  loading.value = false;
  return parsedData;
});

async function processImage(apiUrl: string) {
  try {
    loading.value = true;
    await convertDocument();
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

async function imageUrlToFile(url: string): Promise<File> {
  // Fetch image data from the URL
  const response = await fetch(url);
  const blob = await response.blob();
  // Extract filename from URL
  const filename = url.substring(url.lastIndexOf("/") + 1);
  // Create a File object from the fetched image data
  const file = new File([blob], filename, { type: blob.type });
  return file;
}

async function convertDocument() {
  await imageUrlToFile(imgUrl.value)
    .then((file) => {
      imgFile.value = file;
    })
    .catch((error) => {
      console.error("Error converting image URL to File:", error);
    });
}

function displayData() {
  if (
    extractedData.value &&
    extractedData.value.api_request.status_code == 201
  ) {
    parsedData.value = renameKeys(
      extractedData.value!.document.inference.prediction
    );
    loading.value = false;
  } else {
    alert(
      extractedData.value
        ? extractedData.value.api_request.error.message
        : "An error occurred processing the data"
    );
  }
}

function changeImage(img: string) {
  activeImg.value = img;
  extractedData.value = null;
  if (activeImg.value == "Receipt") {
    previewImg.value = "b7ba9396-0d51-4e1a-a5db-9f6bdf613d5c";
    imgUrl.value = useRuntimeConfig().public.receiptImgUrl;
    processImage("/api/receipt");
  } else if (activeImg.value == "Invoice") {
    processImage("/api/invoice");
    previewImg.value = "e38dad66-8f1a-4821-8598-cf1239c118d4";
    imgUrl.value = useRuntimeConfig().public.invoiceImgUrl;
  }
}
</script>

<template>
  <div class="card custom-card px-5 py-5 shadow-sm border-0">
    <div class="row justify-content-center">
      <div class="col-md-4">
        <div class="d-inline-block overflow-hidden bg-light">
          <NuxtImg
            :src="previewImg"
            provider="myProvider"
            class="demo-img img-fluid border"
            width="944"
            height="586"
          />
        </div>
        <div class="row">
          <div class="mt-3 col-md-4">
            <NuxtImg
              src="b7ba9396-0d51-4e1a-a5db-9f6bdf613d5c"
              provider="myProvider"
              class="img-thumbnail cs-pointer"
              @click="changeImage('Receipt')"
            />
          </div>
          <div class="mt-3 col-md-4">
            <NuxtImg
              src="e38dad66-8f1a-4821-8598-cf1239c118d4"
              provider="myProvider"
              class="img-thumbnail cs-pointer"
              @click="changeImage('Invoice')"
            />
          </div>
        </div>
      </div>
      <div class="col-md-8 extracted-data ps-md-5">
        <DisplayData
          :data="parsedData"
          :docType="activeImg"
          :loading="loading"
        />
      </div>
    </div>
  </div>
</template>
