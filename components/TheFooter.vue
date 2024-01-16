<template>
  <footer class="text-primary fs-6 mt-5">
    <div class="container-xxl fixed-bottom">
      <div class="row my-2 justify-content-center">
        <div class="col-md-6 text-end pt-2">
          <span
            >Copyright &copy; {{ new Date().getFullYear() }} Image2Text by
            Lisette Gonzalez
          </span>
        </div>
        <div class="col-md-4">
          <ul class="nav">
            <li class="nav-item">
              <div class="vr h-75 text-primary align-text-top"></div>
            </li>
            <li class="nav-item ms-1">
              <NuxtLink
                to="https://github.com/lisette900809/image2text"
                target="_blank"
                class="nav-link text-primary"
                ><i class="bi bi-github"></i
              ></NuxtLink>
            </li>
            <li class="nav-item">
              <NuxtLink
                to="https://www.linkedin.com/in/lisette-gonzalez/"
                target="_blank"
                class="nav-link text-primary ps-1"
                ><i class="bi bi-linkedin"></i
              ></NuxtLink>
            </li>
            <li class="nav-item">
              <NuxtLink
                to="https://lisette.dev"
                target="_blank"
                class="nav-link text-primary ps-1"
                ><i class="bi bi-link-45deg"></i
              ></NuxtLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
</template>

<style>
footer {
  top: 35rem;
}
</style>
