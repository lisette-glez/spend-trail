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
const parsedData = ref(null);
const docType = ref("Invoice");
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
  const formData = new FormData();
  formData.append("document", imgFile.value);

  const { data } = await useFetch(docApiUrl, {
    method: "post",
    headers: { Authorization: "Token " + runtimeConfig.public.apiKey },
    body: formData,
  });

  if (data.value.api_request.status_code == 201) {
    extractedData.value = data.value.document.inference.prediction;

    if (docType.value == "Invoice") {
      const invoiceUpdatedKeys = {
        customer_address: "Customer address",
        customer_company_registrations: "Customer registration",
        customer_name: "Customer",
        document_type: "Document type",
        date: "Date",
        due_date: "Due date",
        supplier_name: "Supplier",
        supplier_address: "Supplier address",
        supplier_company_registrations: "Supplier registration",
        invoice_number: "Invoice number",
        total_amount: "Total amount",
        total_net: "Total net",
      };
      parsedData.value = renameKeys(invoiceUpdatedKeys, extractedData.value);
    } else if (docType.value == "Expense Receipt") {
      const receiptUpdatedKeys = {
        total_amount: "Total amount",
        total_tax: "Total tax",
        tip: "Tip",
        total_net: "Total net",
        category: "Category",
        subcategory: "Subcategory",
        date: "Purchase Date",
        time: "Purchase Time",
        supplier_name: "Supplier name",
        supplier_address: "Supplier address",
        supplier_phone_number: "Supplier phone",
        supplier_company_registrations: "Supplier IDs",
        document_type: "Document type",
        locale: "Language",
      };
      parsedData.value = renameKeys(receiptUpdatedKeys, extractedData.value);
    } else if (docType.value == "Driver License") {
      const driverUpdatedKeys = {
        address: "Address",
        state: "State",
        driver_license_id: "Driver License ID",
        expiry_date: "Expiry Date",
        issued_date: "Date Of Issue",
        last_name: "Last Name",
        first_name: "First Name",
        date_of_birth: "Date Of Birth",
        restrictions: "Restrictions",
        endorsements: "Endorsements",
        dl_class: "Driver License Class",
        sex: "Sex",
        weight: "Weight",
        height: "Height",
        hair_color: "Hair Color",
        eye_color: "Eye Color",
        dd_number: "Document Discriminator",
      };
      parsedData.value = renameKeys(driverUpdatedKeys, extractedData.value);
    } else if (docType.value == "Passport") {
      const passportUpdatedKeys = {
        birth_date: "Birth date",
        birth_place: "Birth place",
        country: "Country",
        expiry_date: "Expiry Date",
        gender: "Gender",
        id_number: "Passport number",
        issuance_date: "Issuance date",
        mrz1: "MRZ row 1",
        mrz2: "MRZ row 2",
        surname: "Last name",
      };
      parsedData.value = renameKeys(passportUpdatedKeys, extractedData.value);
    }

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

  if (docType.value == "Invoice") {
    docApiUrl.value = runtimeConfig.public.apiBaseInvoice;
  } else if (docType.value == "Expense Receipt") {
    docApiUrl.value = runtimeConfig.public.apiBaseReceipt;
  } else if (docType.value == "Driver License") {
    docApiUrl.value = runtimeConfig.public.apiBaseDriver;
  } else if (docType.value == "Passport") {
    docApiUrl.value = runtimeConfig.public.apiBasePassport;
  }
}

function goBack() {
  isUpload.value = false;
  responseSuccess.value = false;
  imgFile.value = null;
  imgPreview.value = null;
  parsedData.value = null;
  extractedData.value = null;
}
</script>

<template>
  <section>
    <div class="container mt-5">
      <AppAlert v-if="errorAlert" :errorMessage="errorMessage" />
      <div class="card upload-card p-4">
        <h5 v-if="responseSuccess" class="mt-3 mb-0">
          EXTRACTED DATA FROM YOUR
          <span class="text-uppercase">{{ docType }}</span>
        </h5>
        <div class="row my-4 justify-content-center">
          <div class="col-md-6" v-if="!isUpload">
            <div class="row mb-5 text-center">
              <h5 class="mb-4">Select document type you want process</h5>
              <div class="col-md-3">
                <div
                  class="card doc-type-card p-2"
                  :class="{ typeActive: docType == 'Invoice' }"
                  @click="changeDocType('Invoice')"
                >
                  <i class="bi-file-earmark-text pe-1"></i> <span>Invoice</span>
                </div>
              </div>
              <div class="col-md-3">
                <div
                  class="card doc-type-card p-2"
                  :class="{ typeActive: docType == 'Expense Receipt' }"
                  @click="changeDocType('Expense Receipt')"
                >
                  <i class="bi-receipt pe-1"></i> <span>Receipt</span>
                </div>
              </div>
              <div class="col-md-3">
                <div
                  class="card doc-type-card p-2"
                  :class="{ typeActive: docType == 'Driver License' }"
                  @click="changeDocType('Driver License')"
                >
                  <i class="bi-car-front pe-1"></i> <span>Driver Licence</span>
                </div>
              </div>
              <div class="col-md-3">
                <div
                  class="card doc-type-card p-2"
                  :class="{ typeActive: docType == 'Passport' }"
                  @click="changeDocType('Passport')"
                >
                  <i class="bi-journal-medical pe-1"></i> <span>Passport</span>
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
              <img :src="imgPreview" class="img-fluid py-3 px-2 preview-img" />
            </div>
          </div>
          <div class="col extracted-data" v-if="responseSuccess">
            <ul class="list-group rounded-0 d-flex flex-row flex-wrap">
              <template v-for="(text, key) in parsedData" :key="key">
                <div v-if="text.value != null" class="data-container">
                  <div class="fw-bold key-name">{{ key }}</div>
                  <li class="list-group-item mb-3">
                    <div>{{ text.value }}</div>
                  </li>
                </div>
              </template>
              <div
                class="data-container"
                v-if="docType == 'Invoice' && parsedData.taxes.length > 0"
              >
                <div class="fw-bold key-name">Taxes</div>
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
              <div
                class="data-container"
                v-if="extractedData.locale && !extractedData.locale.value"
              >
                <div class="fw-bold key-name">Language</div>
                <li class="list-group-item mb-3">
                  <div>{{ parsedData.locale.language }}</div>
                </li>
              </div>
              <div class="data-container" v-if="extractedData.locale">
                <div class="fw-bold key-name">Currency</div>
                <li class="list-group-item">
                  <div>{{ extractedData.locale.currency }}</div>
                </li>
              </div>
              <div
                class="data-container"
                v-if="
                  docType == 'Passport' && parsedData.given_names.length > 0
                "
              >
                <div class="fw-bold key-name">Given names</div>
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
              <div class="fw-bold key-name">Line Items</div>
              <li
                class="list-group-item mb-3"
                v-for="(item, index) in parsedData.line_items"
                :key="index"
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
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
