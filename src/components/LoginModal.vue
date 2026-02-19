<script setup>
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useUserStore } from '@/stores/useUserStore'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const isLoading = ref(false)
const router = useRouter()
const userStore = useUserStore()
const emit = defineEmits(['close', 'open-register'])

const openRegister = () => {
  emit('close')
  emit('open-register')
}

const goToForgotPassword = () => {
  emit('close')
  router.push('/forgot-password')
}

const login = async () => {
  isLoading.value = true
  console.log('Email:', email.value)
  console.log('Password:', password.value)
  console.log('API URL:', API_BASE_URL)
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Accept: 'application/json',
        'Cache-Control': 'no-cache',
      },
      body: JSON.stringify({
        user: {
          email: email.value.trim().toLowerCase(),
          password: password.value,
        },
      }),
      redirect: 'follow',
      cache: 'no-store',
    })

    const result = await response.json()
    const token = result.status?.token
    const user = result.status?.data?.user

    if (response.ok && token && user) {
      // Combine token with user data
      const fullUser = {
        ...user,
        token,
        roles: Array.isArray(user.roles) ? user.roles : [],
      }
      userStore.setUser(fullUser)
      await userStore.fetchReadings()
      userStore.showLoginModal = false
    } else {
      const errorMessage =
        result.error || result.status?.message || 'Login failed. Please try again.'
      alert(errorMessage)
    }
  } catch (error) {
    console.error('Login error:', error)

    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      alert(
        `Cannot connect to backend at ${API_BASE_URL}. Please check if your backend server is running.`,
      )
    } else {
      alert(`An error occurred during login: ${error.message}`)
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="login-form">
      <button class="close-btn" @click="$emit('close')">×</button>
      <form @submit.prevent="login">
        <div class="form-group">
          <label class="modal-text" for="email">Email address:</label>
          <input
            v-model="email"
            type="email"
            id="email"
            name="email"
            placeholder="Enter a valid email address where you can be contacted"
            required
            :disabled="isLoading"
          />
        </div>

        <div class="form-group password-wrapper">
          <label class="modal-text" for="password">Password:</label>
          <div class="password-field">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              id="password"
              name="password"
              placeholder="Enter your password"
              required
              :disabled="isLoading"
            />
            <button type="button" class="toggle-password" @click="showPassword = !showPassword">
              {{ showPassword ? 'Hide' : 'Show' }}
            </button>
          </div>
        </div>

        <button type="submit" class="submit-btn" :disabled="isLoading">
          {{ isLoading ? 'Logging in...' : 'Login' }}
        </button>
      </form>

      <div class="auth-links">
        <p class="forgot-password-link">
          <button class="link-button" @click="goToForgotPassword">Forgot Password?</button>
        </p>
        <p class="register-link">
          <button class="link-button" @click="openRegister">Create Account</button>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
