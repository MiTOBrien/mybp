<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/useUserStore'
import { PASSWORD_REGEX, isValidPassword } from '@/utils/passwordRules'

const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const confirmPassword = ref('')
const showConfirmPassword = ref(false)
const acceptedTOS = ref(false)

const isPasswordValid = computed(() => isValidPassword(password.value))
const doPasswordsMatch = computed(() => password.value === confirmPassword.value)

const emit = defineEmits(['close', 'open-login'])

const openLogin = () => {
  emit('close')
  emit('open-login')
}

const router = useRouter()
const userStore = useUserStore()

const register = async () => {
  if (!isPasswordValid.value) {
    alert('Password does not meet complexity requirements')
    return
  }

  if (!doPasswordsMatch.value) {
    alert('Passwords do not match')
    return
  }

  if (!acceptedTOS.value) {
    alert('You must acknowledge the Terms of Service to register.')
    return
  }

  try {
    console.log('Registering user:', email.value) // Debug log
    console.log('API Base URL:', API_BASE_URL) // Debug log
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user: {
          email: email.value,
          password: password.value,
          confirm_password: confirmPassword.value,
          tos_accepted: acceptedTOS.value,
        },
      }),
    })

    const data = await response.json()

    if (response.ok) {
      alert('Registration successful! Please login.')
      userStore.showRegisterModal = false
    } else {
      alert(data.error || 'Registration failed')
    }
  } catch (error) {
    console.error(error)
    alert('An error occurred during registration')
  }
}
</script>

<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="registration-form">
      <button class="close-btn" @click="$emit('close')">×</button>
      <form @submit.prevent="register">
        <div class="form-group">
          <label class="modal-text" for="email">Email address:</label>
          <input
            v-model="email"
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email address"
            required
          />
        </div>

        <!-- Password Field -->
        <div class="form-group password-wrapper">
          <p v-if="!isPasswordValid" class="validation-message">
            Password must be at least 8 characters and include uppercase, lowercase, and a number or
            symbol.
          </p>
          <label class="modal-text" for="password">Password:</label>
          <div class="password-field">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              id="password"
              name="password"
              placeholder="Enter your password"
              required
            />
            <button type="button" class="toggle-password" @click="showPassword = !showPassword">
              {{ showPassword ? 'Hide' : 'Show' }}
            </button>
          </div>
        </div>

        <!-- Confirm Password Field -->
        <div class="form-group password-wrapper">
          <p v-if="!doPasswordsMatch" class="validation-message">Passwords do not match.</p>
          <label class="modal-text" for="confirmpassword">Confirm Password:</label>
          <div class="password-field">
            <input
              v-model="confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              id="confirmpassword"
              name="confirmpassword"
              placeholder="Confirm your password"
              required
            />
            <button
              type="button"
              class="toggle-password"
              @click="showConfirmPassword = !showConfirmPassword"
            >
              {{ showConfirmPassword ? 'Hide' : 'Show' }}
            </button>
          </div>
        </div>

        <div class="tos-group">
          <label class="tos-label">
            <input type="checkbox" v-model="acceptedTOS" />
            I acknowledge and agree to the
            <router-link to="/tos" target="_blank">Terms of Service</router-link>
          </label>
        </div>

        <button type="submit" class="submit-btn" :disabled="!isPasswordValid || !doPasswordsMatch">
          Register
        </button>
      </form>

      <div class="auth-links">
        <p class="login-link">
          <button type="button" class="link-button" @click="openLogin">Back to login</button>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>