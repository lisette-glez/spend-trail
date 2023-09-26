<script setup>
const runtimeConfig = useRuntimeConfig();
const isUpload = ref(false);
const isLoading = ref(false);
const imgFile = ref(null);
const imgPreview = ref(null);
const extractedData = ref(null);
const responseSuccess = ref(false);
const activeTab = ref("device");
const errorAlert = ref(false);
const errorMessage = ref(null);
const allowedTypes = ref([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/tiff",
]);
const invoiceData = ref(null);
const docType = ref("invoice");
const docApiUrl = ref(runtimeConfig.public.apiBaseInvoice);

function onChange(e) {
  imgFile.value = e.files[0];
  if (allowedTypes.value.includes(imgFile.value.type)) {
    isUpload.value = true;
    //image preview
    let reader = new FileReader();
    reader.readAsDataURL(imgFile.value);
    reader.onload = (e) => {
      imgPreview.value = e.target.result;
    };
  } else {
    imgFile.value = null;
    errorMessage.value =
      "File type not allowed. You can upload only jpg, png, webp, heic and tiff images.";
    errorAlert.value = true;
  }
}

async function uploadImage() {
  isLoading.value = true;
  const config = null;
  const formData = new FormData();
  formData.append("document", imgFile.value);

  const { data } = await useFetch(docApiUrl, {
    method: "post",
    headers: { Authorization: "Token " + runtimeConfig.public.apiKey },
    body: formData,
  });

  if (data.value.api_request.status_code == 201) {
    extractedData.value = data.value.document.inference.prediction;
    const invoiceUpdatedKeys = {
      customer_address: "Customer address",
      customer_company_registrations: "Customer registration",
      customer_name: "Customer",
      document_type: "Tipo de documento",
      date: "Date",
      due_date: "Due date",
      supplier_name: "Supplier",
      supplier_address: "Supplier address",
      supplier_company_registrations: "Supplier registration",
      invoice_number: "Invoice number",
      total_amount: "Total amount",
      total_net: "Total net",
    };

    invoiceData.value = renameKeys(invoiceUpdatedKeys, extractedData.value);
    isLoading.value = false;
    responseSuccess.value = true;
  }
}

function renameKeys(keysMap, obj) {
  return Object.keys(obj).reduce(
    (acc, key) => ({
      ...acc,
      ...{ [keysMap[key] || key]: obj[key] },
    }),
    {}
  );
}

function cancelUpload() {
  imgFile.value = null;
  imgPreview.value = null;
  isUpload.value = false;
}

function getUrl(url) {
  imgFile.value = imgPreview.value = url;
  isUpload.value = true;
}

function changeTab(tabName) {
  activeTab.value = tabName;
}

function changeDocType(type) {
  docType.value = type;

  if (docType.value == "invoice") {
    docApiUrl.value = runtimeConfig.public.apiBaseInvoice;
  } else if (docType.value == "receipt") {
    docApiUrl.value = runtimeConfig.public.apiBaseReceipt;
  } else if (docType.value == "driver") {
    docApiUrl.value = runtimeConfig.public.apiBaseDriver;
  }
}
</script>

<template>
  <section>
    <div class="container mt-5">
      <AppAlert v-if="errorAlert" :errorMessage="errorMessage" />
      <div class="card upload-card p-4">
        <h5 v-if="responseSuccess" class="mt-3 mb-0">
          EXTRACTED DATA FROM YOUR {{ extractedData.document_type.value }}
        </h5>
        <div class="row my-4 justify-content-center">
          <div class="col-md-6" v-if="!isUpload">
            <div class="row mb-5 text-center">
              <h5 class="mb-4">Select document type you want process</h5>
              <div class="col">
                <div
                  class="card doc-type-card p-2"
                  :class="{ typeActive: docType == 'invoice' }"
                  @click="changeDocType('invoice')"
                >
                  <span><i class="bi-file-earmark-text pe-1"></i> Invoice</span>
                </div>
              </div>
              <div class="col">
                <div
                  class="card doc-type-card p-2"
                  :class="{ typeActive: docType == 'receipt' }"
                  @click="changeDocType('receipt')"
                >
                  <span><i class="bi-receipt pe-1"></i> Receipt</span>
                </div>
              </div>
              <div class="col">
                <div
                  class="card doc-type-card p-2"
                  :class="{ typeActive: docType == 'driver' }"
                  @click="changeDocType('driver')"
                >
                  <span><i class="bi-car-front pe-1"></i> Driver Licence</span>
                </div>
              </div>
            </div>
            <ul class="nav nav-tabs justify-content-end">
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
            <div class="card-body">
              <div
                v-if="activeTab == 'device' && !isUpload"
                class="uploader"
                @dragover.prevent
                @dragenter.prevent
                @dragstart.prevent
                @drop.prevent="onChange($event.dataTransfer)"
                :class="{ noPaddingTop: isUpload }"
              >
                <div
                  class="file-input"
                  v-if="!isUpload"
                  @click="$refs.file.click()"
                >
                  <div for="file">
                    <img
                      src="~/assets/img/upload-img.png"
                      class="img-fluid upload-image"
                    />
                    <input
                      type="file"
                      ref="file"
                      @change="onChange($event.target)"
                    />
                  </div>
                </div>
                <div class="row justify-content-center">
                  <div class="col-md-5">
                    <p
                      class="h6 upload-title"
                      v-if="!isUpload"
                      @click="$refs.file.click()"
                    >
                      Click to browse, or drag and drop an image here
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <UploadByLink
              @typedUrl="getUrl"
              v-if="activeTab == 'link' && !isUpload"
            />
          </div>
          <div class="col-md-5" v-if="isUpload">
            <ul
              class="nav nav-tabs justify-content-end mb-4"
              v-if="!responseSuccess"
            >
              <li class="nav-item cs-pointer" @click="uploadImage">
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
              <li class="nav-item cs-pointer" @click="cancelUpload">
                <div class="nav-link">
                  <i class="bi-x-circle pe-1 text-danger"></i> Cancel
                </div>
              </li>
            </ul>
            <div>
              <img :src="imgPreview" class="img-fluid py-3 preview-img" />
            </div>
          </div>
          <div class="col-md-3 extracted-data" v-if="responseSuccess">
            <ul class="list-group rounded-0">
              <div v-for="(text, key, index) in invoiceData" :key="index">
                <div v-if="text.value != null">
                  <div class="fw-bold key-name">{{ key }}</div>
                  <li class="list-group-item mb-3">
                    <div>{{ text.value }}</div>
                  </li>
                </div>
              </div>
            </ul>
          </div>
          <div class="col-md-4 extracted-data" v-if="responseSuccess">
            <ul
              class="list-group rounded-0"
              v-if="invoiceData.line_items.length > 0"
            >
              <div class="fw-bold key-name">Line Items</div>
              <li
                class="list-group-item mb-3"
                v-for="(item, index) in invoiceData.line_items"
                :key="index"
              >
                <div>
                  {{ item.quantity || 1 }}- {{ item.description }} x
                  {{ item.unit_price }}.00 - {{ item.total_amount }}.00
                </div>
              </li>
            </ul>
            <ul
              class="list-group rounded-0"
              v-if="invoiceData.reference_numbers.length > 0"
            >
              <div class="fw-bold key-name">PO #</div>
              <li
                class="list-group-item"
                v-for="(reference, index) in invoiceData.reference_numbers"
                :key="index"
              >
                <div>{{ reference.value }}</div>
              </li>
            </ul>
            <ul
              class="list-group rounded-0"
              v-if="invoiceData.taxes.length > 0"
            >
              <div class="fw-bold key-name">Taxes</div>
              <li
                class="list-group-item"
                v-for="(tax, index) in invoiceData.taxes"
                :key="index"
              >
                <div>{{ tax.rate }}% - {{ tax.value }}</div>
              </li>
            </ul>
            <ul class="list-group rounded-0">
              <div class="fw-bold key-name">Language</div>
              <li class="list-group-item">
                <div>{{ invoiceData.locale.language }}</div>
              </li>
            </ul>
            <ul class="list-group rounded-0">
              <div class="fw-bold key-name">Currency</div>
              <li class="list-group-item">
                <div>{{ invoiceData.locale.currency }}</div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
