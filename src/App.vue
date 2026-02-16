<script setup>
import { RouterView } from 'vue-router'
import HeaderView from './views/HeaderView.vue'
import FooterView from './views/FooterView.vue'
</script>

<template>
    <header>
    <div class="wrapper">
      <HeaderView />
    </div>
  </header>
  <main>
    <div class="wrapper">
      <RouterView />
    </div>
  </main>
  <footer>
    <div class="wrapper">
      <FooterView />  
      </div>
  </footer>
</template>

<style scoped></style>