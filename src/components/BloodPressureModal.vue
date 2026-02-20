<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/useUserStore'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const userStore = useUserStore()

// Props: if editingReading is provided, we are in EDIT mode
const props = defineProps({
  editingReading: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['close'])

// Form fields
const readingTime = ref('')
const systolic = ref(null)
const diastolic = ref(null)
const heartRate = ref(null)
const period = ref('AM')
const isLoading = ref(false)

// Prefill fields depending on Add vs Edit mode
onMounted(() => {
  if (props.editingReading) {
    // EDIT MODE
    readingTime.value = props.editingReading.reading_time.slice(0, 16)
    systolic.value = props.editingReading.systolic
    diastolic.value = props.editingReading.diastolic
    heartRate.value = props.editingReading.heart_rate
    period.value = props.editingReading.period || 'AM'
  } else {
    // ADD MODE
    readingTime.value = new Date().toISOString().slice(0, 16)
  }
})

const submitReading = async () => {
  isLoading.value = true

  try {
    const payload = {
      reading_time: readingTime.value,
      systolic: Number(systolic.value),
      diastolic: Number(diastolic.value),
      heart_rate: Number(heartRate.value),
    }

    // Determine Add vs Edit
    const url = props.editingReading ? `${API_BASE_URL}/update-reading` : `${API_BASE_URL}/add-bp`

    const method = props.editingReading ? 'PUT' : 'POST'

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userStore.user?.token}`,
      },
      body: JSON.stringify(
        props.editingReading ? { id: props.editingReading.id, ...payload } : payload,
      ),
    })

    console.log('RAW RESPONSE OBJECT:', response)

    const rawText = await response.clone().text()
    console.log('RAW RESPONSE TEXT:', rawText)

    const result = await response.json()

    if (!response.ok) {
      alert(result.error || 'Unable to save reading.')
      return
    }

    alert(props.editingReading ? 'Reading updated.' : 'Reading saved.')

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
    <div class="login-form" @click.stop>
      <button class="close-btn" @click="$emit('close')">×</button>

      <form @submit.prevent="submitReading">
        <h2 class="modal-title">
          {{ props.editingReading ? 'Edit Reading' : 'Add Blood Pressure Reading' }}
        </h2>

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
          {{
            isLoading
              ? props.editingReading
                ? 'Updating...'
                : 'Saving...'
              : props.editingReading
                ? 'Update Reading'
                : 'Save Reading'
          }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped></style>
