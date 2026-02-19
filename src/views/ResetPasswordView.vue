<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { PASSWORD_REGEX, isValidPassword } from '@/utils/passwordRules'

const route = useRoute()
const router = useRouter()

const token = route.query.token
const loading = ref(true)
const valid = ref(false)
const error = ref('')
const password = ref('')
const confirmPassword = ref('')
const submitting = ref(false)
const success = ref(false)

const isPasswordValid = computed(() => isValidPassword(password.value))
const doPasswordsMatch = computed(() => password.value === confirmPassword.value)

const validateToken = async () => {
  try {
    const res = await fetch('/.netlify/functions/validate-reset-token', {
      method: 'POST',
      body: JSON.stringify({ token }),
    })

    const data = await res.json()
    valid.value = data.valid
    if (!data.valid) error.value = data.reason
  } catch (err) {
    error.value = 'Something went wrong.'
  } finally {
    loading.value = false
  }
}

onMounted(validateToken)

const submit = async () => {
  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match.'
    return
  }

  submitting.value = true
  error.value = ''

  try {
    const res = await fetch('/.netlify/functions/reset-password', {
      method: 'POST',
      body: JSON.stringify({
        token,
        newPassword: password.value,
      }),
    })

    const data = await res.json()

    if (res.ok) {
      success.value = true
    } else {
      error.value = data.error || 'Unable to reset password.'
    }
  } catch (err) {
    error.value = 'Something went wrong.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <main class="auth-page">
    <h1>Reset Password</h1>

    <!-- Loading -->
    <p v-if="loading">Validating token...</p>

    <!-- Invalid token -->
    <div v-else-if="!valid">
      <p class="error">This reset link is invalid or expired.</p>
    </div>

    <!-- Success -->
    <div v-else-if="success">
      <p>Your password has been reset successfully.</p>
      <RouterLink to="/login" class="submit-btn" style="display: inline-block; margin-top: 1rem">
        Return to Login
      </RouterLink>
    </div>

    <!-- Reset form -->
    <form v-else @submit.prevent="submit" class="auth-form">
      <div class="form-group">
        <p v-if="!isPasswordValid" class="validation-message">
          Password must be at least 8 characters and include uppercase, lowercase, and a number or
          symbol.
        </p>
        <label>New Password</label>
        <input
          type="password"
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

      <div class="form-group">
        <p v-if="!doPasswordsMatch" class="validation-message">Passwords do not match.</p>
        <label>Confirm Password</label>
        <input
          type="password"
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

      <button class="submit-btn" :disabled="submitting">
        {{ submitting ? 'Resetting...' : 'Reset Password' }}
      </button>

      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </main>
</template>

<style scoped>
.auth-page {
  max-width: 480px;
  margin: 80px auto;
  background: var(--color-surface);
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid var(--color-border);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.error {
  margin-top: 1rem;
  color: var(--color-danger);
}
</style>
