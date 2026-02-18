<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/useUserStore'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const userStore = useUserStore()
const emit = defineEmits(['close'])

const readingTime = ref('')
const systolic = ref(null)
const diastolic = ref(null)
const heartRate = ref(null)
const period = ref('AM')
const isLoading = ref(false)

// Prefill with current date/time in ISO format
onMounted(() => {
  readingTime.value = new Date().toISOString().slice(0, 16) // yyyy-mm-ddThh:mm
})

const submitReading = async () => {
  isLoading.value = true

  try {
    const response = await fetch(`${API_BASE_URL}/add-bp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userStore.user?.token}`,
      },
      body: JSON.stringify({
        reading_time: readingTime.value,
        systolic: Number(systolic.value),
        diastolic: Number(diastolic.value),
        heart_rate: Number(heartRate.value),
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      alert(result.error || 'Unable to save reading.')
      return
    }

    alert('Blood pressure reading saved.')
    await userStore.fetchReadings()
    emit('close')
  } catch (error) {
    console.error('BP entry error:', error)
    alert('An error occurred while saving your reading.')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="login-form">
      <button class="close-btn" @click="$emit('close')">×</button>

      <form @submit.prevent="submitReading">
        <!-- Reading Time -->
        <div class="form-group">
          <label class="modal-text" for="readingTime">Date & Time:</label>
          <input
            v-model="readingTime"
            type="datetime-local"
            id="readingTime"
            required
            :disabled="isLoading"
          />
        </div>

        <!-- Systolic -->
        <div class="form-group">
          <label class="modal-text" for="systolic">Systolic:</label>
          <input
            v-model="systolic"
            type="number"
            id="systolic"
            min="50"
            max="250"
            required
            :disabled="isLoading"
          />
        </div>

        <!-- Diastolic -->
        <div class="form-group">
          <label class="modal-text" for="diastolic">Diastolic:</label>
          <input
            v-model="diastolic"
            type="number"
            id="diastolic"
            min="30"
            max="150"
            required
            :disabled="isLoading"
          />
        </div>

        <!-- Heart Rate -->
        <div class="form-group">
          <label class="modal-text" for="heartRate">Heart Rate:</label>
          <input
            v-model="heartRate"
            type="number"
            id="heartRate"
            min="30"
            max="200"
            required
            :disabled="isLoading"
          />
        </div>

        <button type="submit" class="submit-btn" :disabled="isLoading">
          {{ isLoading ? 'Saving...' : 'Save Reading' }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped></style>
