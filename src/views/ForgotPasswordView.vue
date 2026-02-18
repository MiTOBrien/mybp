<script setup>
import { ref } from 'vue'

const email = ref('')
const loading = ref(false)
const success = ref(false)
const error = ref('')
const API = '/.netlify/functions/forgot-password'

const submit = async () => {
  loading.value = true
  error.value = ''

  try {
    const res = await fetch(API, {
      method: 'POST',
      body: JSON.stringify({ email: email.value.trim().toLowerCase() }),
    })

    // Always show success regardless of whether the email exists
    success.value = true
  } catch (err) {
    error.value = 'Something went wrong. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="auth-page">
    <h1>Forgot Password</h1>

    <p class="intro">
      Enter your email address and we’ll send you a link to reset your password.
    </p>

    <form @submit.prevent="submit" v-if="!success" class="auth-form">
      <div class="form-group">
        <label>Email</label>
        <input type="email" v-model="email" required />
      </div>

      <button class="submit-btn" :disabled="loading">
        {{ loading ? 'Sending...' : 'Send Reset Link' }}
      </button>

      <p v-if="error" class="error">{{ error }}</p>
    </form>

    <div v-else class="success-message">
      <p>If an account exists for that email, a reset link has been sent.</p>
    </div>
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
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
}

.intro {
  margin-bottom: 1.5rem;
  color: var(--color-text-secondary);
}

.error {
  margin-top: 1rem;
  color: var(--color-danger);
}

.success-message {
  margin-top: 1.5rem;
  color: var(--color-text-primary);
  font-weight: 600;
}
</style>
