<template>
  <footer class="fixed-bottom bg-white">
    <div class="row my-2 d-flex justify-content-between">
      <div class="col text-center pt-2">
        <span>Copyright &copy; Image2Text {{ new Date().getFullYear() }}</span>
      </div>
      <div class="col-md-4 text-center">
        <ul class="nav">
          <li class="nav-item">
            <NuxtLink
              to="https://github.com/lisette900809/image2text"
              target="_blank"
              class="nav-link"
              ><i class="bi bi-github h4"></i
            ></NuxtLink>
          </li>
          <li class="nav-item">
            <NuxtLink
              to="https://www.linkedin.com/in/lisette-gonzalez/"
              target="_blank"
              class="nav-link"
              ><i class="bi bi-linkedin h4"></i
            ></NuxtLink>
          </li>
          <li class="nav-item">
            <NuxtLink to="https://lisette.dev" target="_blank" class="nav-link"
              ><i class="bi bi-link-45deg h4"></i
            ></NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </footer>
</template>
