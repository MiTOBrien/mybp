<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/useUserStore'
import LoginModal from '@/components/LoginModal.vue'
import RegisterModal from '@/components/RegisterModal.vue'

const userStore = useUserStore()

const name = computed(() => userStore.name)

const openLoginModal = () => {
  userStore.showLoginModal = true
  console.log('Modal state:', userStore.showLoginModal)
}
console.log('Modal state:', userStore.showLoginModal)

const handleLogout = () => {
  userStore.logout()
}

const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}
</script>

<template>
  <nav>
    <div class="left-nav">
      <RouterLink class="nav-link home" to="/" @click="closeMenu">Track My BP</RouterLink>
    </div>

    <!-- Desktop navigation -->
    <div class="right-nav desktop-nav">
      <RouterLink class="nav-link" to="/stash">Yarn Stash</RouterLink>
      <RouterLink class="nav-link" to="/patterns">Patterns</RouterLink>
      <div class="navbar-end">
        <div v-if="userStore.isLoggedIn" class="navbar-item">
          Welcome, {{ name }}
          <button @click="handleLogout" class="button nav-button is-light">Logout</button>
        </div>
        <div v-else class="navbar-item">
          <button @click="openLoginModal" class="button nav-button is-primary">Login</button>
        </div>
      </div>
    </div>

    <!-- Mobile hamburger button -->
    <button class="hamburger" @click="toggleMenu" :class="{ active: isMenuOpen }">
      <span></span>
      <span></span>
      <span></span>
    </button>

    <!-- Mobile navigation menu -->
    <div class="mobile-nav" :class="{ open: isMenuOpen }">
      <RouterLink class="nav-link" to="/stash" @click="closeMenu">Yarn Stash</RouterLink>
      <RouterLink class="nav-link" to="/patterns" @click="closeMenu">Patterns</RouterLink>
    </div>
  </nav>

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

<style scoped>

</style>
