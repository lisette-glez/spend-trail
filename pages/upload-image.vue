<template>
  <section>
    <div class="container">
      <div class="row my-5 justify-content-center">
        <div class="col-md-8">
          <div class="card upload-card mt-4">
            <div class="card-body">
              <div class="text-center mt-3">
                <h5 class="fw-bolder">
                  Select image to Upload or Drag and Drop
                </h5>
              </div>
              <div class="uploader">
                <div class="file-input">
                  <div for="file">
                    <img
                      src="~/assets/img/upload-img.png"
                      class="img-fluid upload-image"
                    />
                    <p class="custom-subtitle mt-4">
                      <button size="sm" class="btn btn-info upload-btn">
                        <i class="bi-plus-circle-dotted btn-icon"></i> Browse
                        image
                      </button>
                    </p>
                    <input type="file" ref="file" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
