<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/stores/useUserStore'
import BloodPressureModal from '@/components/BloodPressureModal.vue'
import { groupReadings } from '@/utils/groupReadings'
import { formatTime } from '@/utils/formatTime'
import { formatDateKey } from '@/utils/formatDateKey'
import { getBpColor } from '@/utils/bpColor'

const userStore = useUserStore()
const grouped = computed(() => groupReadings(userStore.readings))

const openBloodPressureModal = () => {
  userStore.showBpModal = true
}

const confirmDelete = async (id) => {
  if (!confirm('Delete this reading?')) return

  await fetch('/.netlify/functions/delete-reading', {
    method: 'DELETE',
    body: JSON.stringify({ id }),
  })

  // Refresh readings
  await userStore.fetchReadings()
}
</script>

<template>
  <h1>Track My BP</h1>

  <h2>The fastest and easiest way to track your blood pressure and share it with your doctor.</h2>

  <p>
    With our intuitive interface, you can quickly log your blood pressure readings, view trends over
    time, and generate reports to share with your healthcare provider. Say goodbye to paper logs and
    hello to effortless tracking!
  </p>

  <!-- Show this ONLY when logged OUT -->
  <p v-if="!userStore.user">
    Create an account or login to get started tracking your blood pressure.
  </p>

  <!-- Show this ONLY when logged IN -->
  <button
    v-if="userStore.user"
    @click="openBloodPressureModal"
    class="button nav-button is-primary"
  >
    Add Blood Pressure Reading
  </button>

  <div v-for="(day, date) in grouped" :key="date" class="day-card">
    <h3 class="day-header">{{ formatDateKey(date) }}</h3>

    <!-- Morning -->
    <div v-if="day.am.length" class="period-row">
      <strong class="period-label">Morning</strong>
      <div class="reading-row">
        <div v-for="(r, i) in day.am" :key="i" class="reading-item">
          <button @click="confirmDelete(r.id)" class="button nav-button is-primary">
            Delete
          </button>
          <span :class="['bp-dot', getBpColor(r.systolic, r.diastolic)]"></span>
          <span class="reading-time">{{ formatTime(r.reading_time) }}</span>
          <span class="reading-bp">{{ r.systolic }}/{{ r.diastolic }}</span>
          <span class="reading-hr">{{ r.heart_rate }} bpm</span>
        </div>
      </div>
    </div>

    <!-- Evening -->
    <div v-if="day.pm.length" class="period-row">
      <strong class="period-label">Evening</strong>
      <div class="reading-row">
        <div v-for="(r, i) in day.pm" :key="i" class="reading-item">
          <button @click="confirmDelete(r.id)" class="button nav-button is-primary">Delete</button>
          <span :class="['bp-dot', getBpColor(r.systolic, r.diastolic)]"></span>
          <span class="reading-time">{{ formatTime(r.reading_time) }}</span>
          <span class="reading-bp">{{ r.systolic }}/{{ r.diastolic }}</span>
          <span class="reading-hr">{{ r.heart_rate }} bpm</span>
        </div>
      </div>
    </div>
  </div>

  <!-- BP Modal -->
  <BloodPressureModal v-if="userStore.showBpModal" @close="userStore.showBpModal = false" />
</template>

<style scoped></style>
