<script setup>
import { computed, ref } from 'vue'
import { useUserStore } from '@/stores/useUserStore'
import LoginModal from '@/components/LoginModal.vue'
import RegisterModal from '@/components/RegisterModal.vue'

const userStore = useUserStore()

const name = computed(() => userStore.name)

const openLoginModal = () => {
  userStore.showLoginModal = true
}

const handleLogout = () => {
  userStore.logout()
}

const isMenuOpen = ref(false)
const toggleMenu = () => (isMenuOpen.value = !isMenuOpen.value)
const closeMenu = () => (isMenuOpen.value = false)
</script>

<template>
  <nav>
    <RouterLink class="home" to="/" @click="closeMenu">Track My BP</RouterLink>

    <!-- Desktop Nav -->
    <div class="right-nav">
      <div v-if="userStore.isLoggedIn" class="navbar-item">
        Welcome!
        <button @click="handleLogout" class="nav-button is-light">Logout</button>
      </div>
      <div v-else class="navbar-item">
        <button @click="openLoginModal" class="nav-button">Login</button>
      </div>
    </div>

    <!-- Hamburger -->
    <button class="hamburger" @click="toggleMenu">
      <span></span>
      <span></span>
      <span></span>
    </button>
  </nav>

  <!-- Mobile Nav -->
  <div class="mobile-nav" :class="{ open: isMenuOpen }">
    <RouterLink class="nav-link" to="/" @click="closeMenu">Home</RouterLink>

    <template v-if="userStore.isLoggedIn">
      <button class="nav-button is-light" @click="handleLogout">Logout</button>
    </template>

    <template v-else>
      <button class="nav-button" @click="openLoginModal">Login</button>
    </template>
  </div>

  <!-- Modals -->
  <LoginModal
    v-if="userStore.showLoginModal"
    @close="userStore.showLoginModal = false"
    @open-register="
      () => {
        userStore.showLoginModal = false
        userStore.showRegisterModal = true
      }
    "
  />

  <RegisterModal
    v-if="userStore.showRegisterModal"
    @close="userStore.showRegisterModal = false"
    @open-login="
      () => {
        userStore.showRegisterModal = false
        userStore.showLoginModal = true
      }
    "
  />
</template>
