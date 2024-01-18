<script setup lang="ts">
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const receiptData = ref(<any>null);
const receiptUrl = ref(<any>null);

onMounted(() => {
  fetchReceiptData();
});

async function fetchReceiptData() {
  const docType = "EXPENSE RECEIPT";
  let query = supabase
    .from("documents")
    .select("id, category, purchase_date, supplier_name, total_amount");

  if (user.value) {
    query = query.eq("user_id", user.value.id);
    query = query.eq("doc_type", docType);
  }
  const { data, error } = await query.order("purchase_date", {
    ascending: false,
  });

  if (error) {
    console.log(error);
  } else {
    receiptData.value = data;
  }
}

function getReceiptImage(id: string) {
  const url = supabase.storage.from("receipts").getPublicUrl(id);
  receiptUrl.value = url.data.publicUrl;
}
</script>

<template>
  <div class="row justify-content-start pt-4">
    <div class="col-md-3" v-for="item in receiptData" :key="item.id">
      <div class="card shadow-sm mb-4">
        <div class="p-4">
          <div class="row">
            <div class="col-md-3">
              <i class="bi bi-shop" style="font-size: 3rem"></i>
            </div>
            <div class="col-md-7 align-self-center">
              <h5 class="mb-0">
                {{ item.supplier_name ? item.supplier_name : "Unknown" }}
              </h5>
              <span class="text-body-tertiary">
                {{ item.purchase_date ? item.purchase_date : "Unknown" }}
              </span>
            </div>
            <div class="col-md-2 text-end align-self-center">
              <i
                class="bi bi-camera fs-4 cs-pointer"
                data-bs-toggle="modal"
                data-bs-target="#imgModal"
                @click="getReceiptImage(item.id)"
              ></i>
            </div>
          </div>
        </div>
        <div class="card-footer">
          <div class="row">
            <div class="col text-start text-uppercase">{{ item.category }}</div>
            <div class="col text-end">
              <i class="bi bi-cash align-middle"> </i> ${{ item.total_amount }}
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
</template>
