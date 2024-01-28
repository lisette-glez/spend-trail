<script setup lang="ts">
const docType = ref("Invoice");
const emit = defineEmits(["selectedDocType"]);

function changeDocType(type: string) {
  docType.value = type;
}
</script>

<template>
  <div
    class="modal fade"
    id="myModal"
    tabindex="-1"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    role="dialog"
    aria-labelledby="modalTitleId"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-md modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header border-0 pb-0">
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body text-center">
          <h5 class="mb-4">Select a document type</h5>
          <div class="row mb-3 justify-content-center px-4">
            <div class="col-md-4">
              <div
                class="card doc-type-card p-2"
                :class="{ typeActive: docType == 'Expense Receipt' }"
                @click="changeDocType('Expense Receipt')"
              >
                <i class="bi-receipt pe-1"></i> <span>Receipt</span>
              </div>
            </div>
            <div class="col-md-4">
              <div
                class="card doc-type-card p-2"
                :class="{ typeActive: docType == 'Invoice' }"
                @click="changeDocType('Invoice')"
              >
                <i class="bi-file-earmark-text pe-1"></i> <span>Invoice</span>
              </div>
            </div>
            <div class="col-md-4">
              <div
                class="card doc-type-card p-2"
                :class="{ typeActive: docType == 'Passport' }"
                @click="changeDocType('Passport')"
              >
                <i class="bi-journal-medical pe-1"></i> <span>Passport</span>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-primary"
            data-bs-dismiss="modal"
            @click="emit('selectedDocType', docType)"
          >
            <i class="bi-check-circle pe-2"></i>Accept
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
