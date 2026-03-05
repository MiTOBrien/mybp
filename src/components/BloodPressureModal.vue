<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/useUserStore'
import { getLocalDateTimeString } from '@/utils/getLocalDateTimeString'
import { useToastStore } from '@/stores/useToastStore'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const userStore = useUserStore()
const toast = useToastStore()

// Props: if editingReading is provided, we are in EDIT mode
const props = defineProps({
  editingReading: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['close'])

// Form fields
const medicationTaken = ref(false)
const readingTime = ref(getLocalDateTimeString())
const systolic = ref(null)
const diastolic = ref(null)
const heartRate = ref(null)
const period = ref('AM')
const isLoading = ref(false)

// Prefill fields depending on Add vs Edit mode
onMounted(() => {
  if (props.editingReading) {
    // EDIT MODE
    medicationTaken.value = props.editingReading.medication_taken || false
    readingTime.value = props.editingReading.reading_time.slice(0, 16)
    systolic.value = props.editingReading.systolic
    diastolic.value = props.editingReading.diastolic
    heartRate.value = props.editingReading.heart_rate
    period.value = props.editingReading.period || 'AM'
  } else {
    // ADD MODE
    readingTime.value = getLocalDateTimeString()
  }
})

const submitReading = async () => {
  isLoading.value = true

  try {
    const payload = {
      medication_taken: medicationTaken.value,
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

    const result = await response.json()

    if (!response.ok) {
      toast.show(result.error || 'Unable to save reading.', 'error')
      return
    }

    toast.show(props.editingReading ? 'Reading updated.' : 'Reading saved.', 'success')

    await userStore.fetchRecentReadings(7)
    await userStore.fetchAllReadings()
    emit('close')
  } catch (error) {
    toast.show('An error occurred while saving your reading.', 'error')
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

        <!-- Medication Taken-->
        <div>
          <label class="modal-text med-label" for="medicationTaken">
            <input type="checkbox" id="medicationTaken" v-model="medicationTaken" />
            Medication Taken (if prescribed)
          </label>
        </div>

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
