<script setup>
import { computed, nextTick, ref } from 'vue'
import { useUserStore } from '@/stores/useUserStore'
import BloodPressureModal from '@/components/BloodPressureModal.vue'
import { groupReadings } from '@/utils/groupReadings'
import { formatTime } from '@/utils/formatTime'
import { formatDateKey } from '@/utils/formatDateKey'
import { getBpColor } from '@/utils/bpColor'

const userStore = useUserStore()
const email = userStore.user?.email
const displayName = computed(() => {
  const email = userStore.user?.email
  if (!email) return null

  return email
    .split('@')[0]
    .split('.')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
})

const grouped = computed(() => groupReadings(userStore.readings))

const last7DaysReadings = computed(() => {
  if (!userStore.user) return []

  const now = new Date()
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(now.getDate() - 7)

  return userStore.readings.filter((r) => {
    const date = new Date(r.reading_time)
    return date >= sevenDaysAgo && date <= now
  })
})

const weeklyAvgSystolic = computed(() => {
  const readings = last7DaysReadings.value
  if (!readings.length) return null

  const sum = readings.reduce((acc, r) => acc + r.systolic, 0)
  return Math.round(sum / readings.length)
})

const weeklyAvgDiastolic = computed(() => {
  const readings = last7DaysReadings.value
  if (!readings.length) return null

  const sum = readings.reduce((acc, r) => acc + r.diastolic, 0)
  return Math.round(sum / readings.length)
})

const highReadingsCount = computed(() => {
  const readings = last7DaysReadings.value
  return readings.filter((r) => r.systolic >= 130 || r.diastolic >= 80).length
})

const medicationTakenCount = computed(() => {
  const readings = last7DaysReadings.value
  if (!readings.length) return 0

  return readings.filter((r) => r.medication_taken).length
})

const editingReading = ref(null)

const openBloodPressureModal = () => {
  editingReading.value = null
  userStore.showBpModal = true
}

const openEditModal = (reading) => {
  editingReading.value = { ...reading }
  userStore.showBpModal = true
}

const confirmDelete = async (id) => {
  if (!confirm('Delete this reading?')) return

  await fetch('/.netlify/functions/delete-reading', {
    method: 'DELETE',
    body: JSON.stringify({ id }),
  })

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

  <hr />

  <p v-if="!userStore.user">
    Create an account or login to get started tracking your blood pressure.
  </p>

  <p v-if="displayName">Welcome {{ displayName }}!</p>

  <button
    v-if="userStore.user"
    @click="openBloodPressureModal"
    class="button nav-button add-reading-btn is-primary"
  >
    Add Blood Pressure Reading
  </button>

  <!-- Weekly Summary -->
  <div v-if="userStore.user" class="summary-card">
    <div class="summary-header">Last 7 days</div>

    <div class="summary-grid">
      <div class="summary-item" @click="goToInsights">
        <div class="label">Avg BP</div>
        <div class="value">{{ weeklyAvgSystolic }}/{{ weeklyAvgDiastolic }}</div>
      </div>

      <div class="summary-item" @click="goToInsights">
        <div class="label">High Readings</div>
        <div class="value">{{ highReadingsCount }}</div>
      </div>

      <div class="summary-item" @click="goToInsights">
        <div class="label">Medication Taken</div>
        <div class="value">
          {{ medicationTakenCount }}
          {{ medicationTakenCount === 1 ? 'time' : 'times' }}
        </div>
      </div>
    </div>
  </div>

  <!-- BP Readings -->
  <div v-for="(day, date) in grouped" :key="date" class="day-card">
    <h3 class="day-header">{{ formatDateKey(date) }}</h3>

    <!-- MORNING -->
    <div v-if="day.am.length" class="period-row">
      <strong class="period-label">Morning</strong>

      <div class="reading-row">
        <div v-for="(r, i) in day.am" :key="i" class="reading-item">
          <!-- TOP ROW -->
          <div class="reading-top-row">
            <button class="icon-btn delete" @click="confirmDelete(r.id)">
              <svg viewBox="0 0 24 24" class="icon">
                <path
                  fill="currentColor"
                  d="M9 3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1h5v2H4V3h5zm1 6v9a1 1 0 0 0 2 0V9h-2zm4 0v9a1 1 0 0 0 2 0V9h-2zM6 5h12l-1 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 5z"
                />
              </svg>
            </button>

            <button class="icon-btn" @click="openEditModal(r)">
              <svg viewBox="0 0 24 24" class="icon">
                <path
                  fill="currentColor"
                  d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
                />
              </svg>
            </button>

            <span :class="['bp-dot', getBpColor(r.systolic, r.diastolic)]"></span>
            <span class="reading-time">{{ formatTime(r.reading_time) }}</span>
            <span class="reading-bp">{{ r.systolic }}/{{ r.diastolic }}</span>
            <span class="reading-hr">{{ r.heart_rate }} bpm</span>
          </div>
          <div v-if="r.medication_taken" class="medication-line">Medication Taken</div>
        </div>
      </div>
    </div>

    <!-- EVENING -->
    <div v-if="day.pm.length" class="period-row">
      <strong class="period-label">Evening</strong>

      <div class="reading-row">
        <div v-for="(r, i) in day.pm" :key="i" class="reading-item">
          <!-- TOP ROW -->
          <div class="reading-top-row">
            <button class="icon-btn delete" @click="confirmDelete(r.id)">
              <svg viewBox="0 0 24 24" class="icon">
                <path
                  fill="currentColor"
                  d="M9 3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1h5v2H4V3h5zm1 6v9a1 1 0 0 0 2 0V9h-2zm4 0v9a1 1 0 0 0 2 0V9h-2zM6 5h12l-1 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 5z"
                />
              </svg>
            </button>

            <button class="icon-btn" @click="openEditModal(r)">
              <svg viewBox="0 0 24 24" class="icon">
                <path
                  fill="currentColor"
                  d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
                />
              </svg>
            </button>

            <span :class="['bp-dot', getBpColor(r.systolic, r.diastolic)]"></span>
            <span class="reading-time">{{ formatTime(r.reading_time) }}</span>
            <span class="reading-bp">{{ r.systolic }}/{{ r.diastolic }}</span>
            <span class="reading-hr">{{ r.heart_rate }} bpm</span>
          </div>
          <div v-if="r.medication_taken" class="medication-line">Medication Taken</div>
        </div>
      </div>
    </div>
  </div>

  <BloodPressureModal
    v-if="userStore.showBpModal"
    :editingReading="editingReading"
    @close="
      async () => {
        userStore.showBpModal = false
        await nextTick()
        editingReading.value = null
      }
    "
  />
</template>

<style scoped>
/* BP Summary */
.summary-card {
  background: #f7f9fc;
  border-radius: 12px;
  padding: 12px 16px;
  margin: 12px 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.summary-header {
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.summary-item {
  background: white;
  border-radius: 8px;
  padding: 10px;
  text-align: center;
  cursor: pointer;
  transition: background 0.15s;
}

.summary-item:hover {
  background: #f0f4fa;
}

.label {
  font-size: 0.75rem;
  color: #666;
  margin-bottom: 4px;
}

.value {
  font-size: 1rem;
  font-weight: 600;
  color: #222;
}

/* Mobile responsiveness */
@media (max-width: 480px) {
  .summary-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 360px) {
  .summary-grid {
    grid-template-columns: 1fr;
  }
}
/* End of BP Summary */

.icon-btn {
  background: none;
  border: none;
  padding: 3px;
  margin-right: 3px;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.icon-btn .icon {
  width: 15px;
  height: 15px;
  color: #444;
}

.icon-btn:active .icon {
  transform: scale(0.9);
}

/* Prevent wrapping of time, BP, and HR */
.reading-time,
.reading-bp,
.reading-hr {
  white-space: nowrap;
}

/* Tighten spacing between items */
.reading-item {
  display: flex;
  align-items: center;
  gap: 6px; /* reduce from whatever it was */
}

/* Shrink text slightly on small screens */
@media (max-width: 480px) {
  .reading-time,
  .reading-bp,
  .reading-hr {
    font-size: 0.9rem;
  }

  .icon-btn .icon {
    width: 18px;
    height: 18px;
  }
}
</style>
