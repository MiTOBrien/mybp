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
}

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
    <div class="right-nav">
      <div class="navbar-end">
        <div v-if="userStore.isLoggedIn" class="navbar-item">
          Welcome!
          <button @click="handleLogout" class="button nav-button is-light">Logout</button>
        </div>
        <div v-else class="navbar-item">
          <button @click="openLoginModal" class="button nav-button is-primary">Login</button>
        </div>
      </div>
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
