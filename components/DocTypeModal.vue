<script setup lang="ts">
const docType = ref("Expense Receipt");
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
        <div class="modal-header">
          <h5 class="modal-title">Select document type</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body text-center">
          <div class="row my-3 justify-content-center">
            <div class="col-md-4">
              <div
                class="card doc-type-card p-2 mb-3"
                :class="{ typeActive: docType == 'Expense Receipt' }"
                @click="changeDocType('Expense Receipt')"
              >
                <i class="bi-receipt pe-1"></i> <span>Receipt</span>
              </div>
            </div>
            <div class="col-md-4 offset-md-1">
              <div
                class="card doc-type-card p-2"
                :class="{ typeActive: docType == 'Invoice' }"
                @click="changeDocType('Invoice')"
              >
                <i class="bi-file-earmark-text pe-1"></i> <span>Invoice</span>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn regular-btn text-light"
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

<style lang="scss">
.doc-type-card {
  border-color: var(--blue-50);
  cursor: pointer;
}

.doc-type-card i {
  color: var(--blue-50);
  font-size: var(--text-lg);
}

.doc-type-card span {
  font-size: var(--text-base);
  color: var(--gray-200);
}

.doc-type-card:hover,
.typeActive {
  background-color: var(--hover-50);
}
</style>
