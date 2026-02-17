<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/stores/useUserStore'
import BloodPressureModal from '@/components/BloodPressureModal.vue'
import { groupReadings } from '@/utils/groupReadings'
import { formatTime } from '@/utils/formatTime'
// import { parseLocalDateTime } from '@/utils/parseLocalDateTime'
import { formatDateKey } from '@/utils/formatDateKey'

const userStore = useUserStore()
const grouped = computed(() => groupReadings(userStore.readings))

const openBloodPressureModal = () => {
  userStore.showBpModal = true
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

  <div v-for="(day, date) in grouped" :key="date" class="day-row">
    <h3 v-if="date">{{ formatDateKey(date) }}</h3>

    <!-- Morning -->
    <div v-if="day.am.length" class="period-row">
      <strong>Morning</strong>
      <div class="reading-block" v-for="(r, i) in day.am" :key="i">
        <span>{{ formatTime(r.reading_time) }}</span>
        <span>{{ r.systolic }}/{{ r.diastolic }}</span>
        <span>{{ r.heart_rate }} bpm</span>
      </div>
    </div>

    <!-- Evening -->
    <div v-if="day.pm.length" class="period-row">
      <strong>Evening</strong>
      <div class="reading-block" v-for="(r, i) in day.pm" :key="i">
        <span>{{ formatTime(r.reading_time) }}</span>
        <span>{{ r.systolic }}/{{ r.diastolic }}</span>
        <span>{{ r.heart_rate }} bpm</span>
      </div>
    </div>
  </div>

  <!-- BP Modal -->
  <BloodPressureModal v-if="userStore.showBpModal" @close="userStore.showBpModal = false" />
</template>

<style scoped></style>
