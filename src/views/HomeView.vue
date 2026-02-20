<script setup>
import { computed, nextTick, ref } from 'vue'
import { useUserStore } from '@/stores/useUserStore'
import BloodPressureModal from '@/components/BloodPressureModal.vue'
import { groupReadings } from '@/utils/groupReadings'
import { formatTime } from '@/utils/formatTime'
import { formatDateKey } from '@/utils/formatDateKey'
import { getBpColor } from '@/utils/bpColor'

const userStore = useUserStore()
const grouped = computed(() => groupReadings(userStore.readings))

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
      </div>
    </div>

    <!-- Evening -->
    <div v-if="day.pm.length" class="period-row">
      <strong class="period-label">Evening</strong>
      <div class="reading-row">
        <div v-for="(r, i) in day.pm" :key="i" class="reading-item">
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
      </div>
    </div>
  </div>

  <!-- BP Modal -->
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
</style>
