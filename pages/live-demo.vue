<script setup lang="ts">
const imgUrl = ref(useRuntimeConfig().public.receiptImgUrl);
const imgFile = ref();
const previewImg = ref("b7ba9396-0d51-4e1a-a5db-9f6bdf613d5c");
const activeImg = ref("Receipt");
const apiUrl = ref("/api/receipt");
const componentKey = ref(0);

onMounted(() => {
  convertDocument();
});

const forceRerender = () => {
  componentKey.value += 1;
};

async function convertDocument() {
  await convertUrlToFile(imgUrl.value)
    .then((file) => {
      imgFile.value = file;
    })
    .catch((error) => {
      console.error("Error converting image URL to File:", error);
    });
}

async function changeImage(img: string) {
  activeImg.value = img;
  if (activeImg.value == "Receipt") {
    apiUrl.value = "/api/receipt";
    previewImg.value = "b7ba9396-0d51-4e1a-a5db-9f6bdf613d5c";
    imgUrl.value = useRuntimeConfig().public.receiptImgUrl;
  } else {
    apiUrl.value = "/api/invoice";
    previewImg.value = "e38dad66-8f1a-4821-8598-cf1239c118d4";
    imgUrl.value = useRuntimeConfig().public.invoiceImgUrl;
  }
  await convertDocument();
  forceRerender();
}
</script>

<template>
  <div class="card main-card p-5 shadow-sm border-0">
    <div class="row justify-content-center">
      <div class="col-md-4">
        <div class="d-inline-block overflow-hidden bg-light">
          <NuxtImg
            :src="previewImg"
            provider="myProvider"
            class="demo-img img-fluid preview-img"
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
          :file="imgFile"
          :url="apiUrl"
          :docType="activeImg"
          :key="componentKey"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.demo-img {
  -webkit-transition: all 0.2s ease;
  -moz-transition: all 0.2s ease;
  -ms-transition: all 0.2s ease;
  -o-transition: all 0.2s ease;
  transition: all 0.2s ease;
  vertical-align: middle;
}

.demo-img:hover {
  -webkit-transform: scale(1.6);
  /* Safari and Chrome */
  -moz-transform: scale(1.6);
  /* Firefox */
  -ms-transform: scale(1.6);
  /* IE 9 */
  -o-transform: scale(1.6);
  /* Opera */
  transform: scale(1.6);
  cursor: zoom-in;
}
</style>
