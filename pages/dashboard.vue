<script setup lang="ts">
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const fetchedData = ref(<any>null);
const receiptUrl = ref(<any>null);
const activeTab = ref("EXPENSE RECEIPT");

onMounted(() => {
  fetchUploadData();
});

async function fetchUploadData() {
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

function getReceiptImage(id: string) {
  const url = supabase.storage.from("receipts").getPublicUrl(id);
  receiptUrl.value = url.data.publicUrl;
}
</script>

<template>
  <div class="row">
    <div class="col">
      <div class="card custom-card px-5 pt-3 pb-5 shadow-sm">
        <ul class="nav nav-tabs mb-4">
          <li class="nav-item cs-pointer" @click="changeTab('EXPENSE RECEIPT')">
            <a
              class="nav-link"
              :class="{ active: activeTab == 'EXPENSE RECEIPT' }"
              >RECEIPTS</a
            >
          </li>
          <li class="nav-item cs-pointer" @click="changeTab('INVOICE')">
            <a class="nav-link" :class="{ active: activeTab == 'INVOICE' }"
              >INVOICES</a
            >
          </li>
        </ul>
        <div class="row justify-content-start pt-2">
          <div class="col-md-4" v-for="item in fetchedData" :key="item.id">
            <div class="card mb-4 border-info">
              <div class="ps-4 pe-3 pt-1 pb-3">
                <div class="row">
                  <div class="col text-end">
                    <i
                      class="bi bi-camera fs-5 cs-pointer"
                      data-bs-toggle="modal"
                      data-bs-target="#imgModal"
                      @click="getReceiptImage(item.id)"
                    ></i>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-2">
                    <i
                      class="bi bi-receipt text-info text-opacity-50"
                      style="font-size: 2.7rem"
                      v-if="activeTab == 'EXPENSE RECEIPT'"
                    ></i>
                    <i
                      v-else
                      class="bi bi-file-earmark-text text-info text-opacity-50"
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
                  <img :src="receiptUrl" class="img-fluid" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
