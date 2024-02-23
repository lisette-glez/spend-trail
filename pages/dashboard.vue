<script setup lang="ts">
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const fetchedData = ref(<any>null);
const activeTab = ref("EXPENSE RECEIPT");
const docId = ref("");
const loading = ref(false);

onMounted(() => {
  fetchUploadData();
});

async function fetchUploadData() {
  loading.value = true;
  let query = supabase
    .from("documents")
    .select(
      "id, invoice_number, category, purchase_date, supplier_name, total_amount"
    );

  if (user.value) {
    query = query.eq("user_id", user.value.id);
    query = query.eq("doc_type", activeTab.value);
  }
  const { data, error } = await query.order("purchase_date", {
    ascending: false,
  });
  loading.value = false;
  if (error) {
    console.log(error);
  } else {
    fetchedData.value = data;
  }
}

function changeTab(tabName: string) {
  activeTab.value = tabName;
  fetchUploadData();
}

function getDocName(id: string) {
  docId.value = id;
}
</script>

<template>
  <div class="row">
    <div class="col">
      <div class="card main-card px-5 pt-3 pb-5 shadow-sm">
        <ul class="nav nav-tabs mb-4">
          <li class="nav-item cs-pointer" @click="changeTab('EXPENSE RECEIPT')">
            <NuxtLink
              class="nav-link"
              :class="{ active: activeTab == 'EXPENSE RECEIPT' }"
              >Receipts</NuxtLink
            >
          </li>
          <li class="nav-item cs-pointer" @click="changeTab('INVOICE')">
            <NuxtLink
              class="nav-link"
              :class="{ active: activeTab == 'INVOICE' }"
              >Invoices</NuxtLink
            >
          </li>
        </ul>
        <div class="row justify-content-start pt-2">
          <div class="text-center mt-2" v-if="loading">
            <div class="spinner-border regular-color" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
          <div
            class="col-md-4"
            v-for="item in fetchedData"
            :key="item.id"
            v-else
          >
            <div class="card mb-4 regular-border">
              <div class="ps-4 pe-3 pt-1 pb-3">
                <div class="row">
                  <div class="col text-end">
                    <i
                      class="bi bi-camera fs-5 cs-pointer"
                      data-bs-toggle="modal"
                      data-bs-target="#imgModal"
                      @click="getDocName(item.id)"
                    ></i>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2">
                    <i
                      class="bi bi-receipt regular-color"
                      style="font-size: 2.7rem"
                      v-if="activeTab == 'EXPENSE RECEIPT'"
                    ></i>
                    <i
                      v-else
                      class="bi bi-file-earmark-text regular-color"
                      style="font-size: 2.7rem"
                    ></i>
                  </div>
                  <div class="col-md-10 align-self-center">
                    <h5 class="mb-0">
                      {{ item.supplier_name ? item.supplier_name : "Unknown" }}
                    </h5>
                    <span class="text-body-tertiary">
                      {{ item.purchase_date ? item.purchase_date : "Unknown" }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="card-footer bg-light-subtle">
                <div class="row">
                  <div class="col text-start text-uppercase">
                    {{ item.category ? item.category : item.invoice_number }}
                  </div>
                  <div class="col text-end">
                    <i class="bi bi-cash align-middle"> </i> ${{
                      item.total_amount
                    }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal fade" id="imgModal" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                <div class="modal-header border-0">
                  <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div class="modal-body px-4 pt-1">
                  <NuxtImg
                    v-if="docId"
                    :src="docId"
                    provider="myProvider"
                    class="img-fluid preview-img"
                    width="944"
                    height="586"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
