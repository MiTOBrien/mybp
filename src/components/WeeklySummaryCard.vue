<script setup>
import { computed } from 'vue'

const props = defineProps({
  readings: {
    type: Array,
    required: true,
  },
  days: {
    type: Number,
    default: 7,
  },
})

const filteredReadings = computed(() => {
  const now = new Date()
  const cutoff = new Date()
  cutoff.setDate(now.getDate() - props.days)

  return props.readings.filter((r) => {
    const date = new Date(r.reading_time)
    return date >= cutoff && date <= now
  })
})

const avgSystolic = computed(() => {
  if (!filteredReadings.value.length) return null
  const sum = filteredReadings.value.reduce((acc, r) => acc + r.systolic, 0)
  return Math.round(sum / filteredReadings.value.length)
})

const avgDiastolic = computed(() => {
  if (!filteredReadings.value.length) return null
  const sum = filteredReadings.value.reduce((acc, r) => acc + r.diastolic, 0)
  return Math.round(sum / filteredReadings.value.length)
})

const highReadingsCount = computed(() =>
  filteredReadings.value.filter(
    (r) => r.systolic >= 130 || r.diastolic >= 80
  ).length
)

const medicationTakenCount = computed(() =>
  filteredReadings.value.filter((r) => r.medication_taken).length
)
</script>

<template>
  <div class="summary-card">
    <div class="summary-header">Last {{ days }} days</div>

    <div class="summary-grid">
      <div class="summary-item">
        <div class="label">Avg BP</div>
        <div class="value">
          {{ avgSystolic }}/{{ avgDiastolic }}
        </div>
      </div>

      <div class="summary-item">
        <div class="label">
          High Readings <br />
          (systolic ≥ 130 or diastolic ≥ 80)
        </div>
        <div class="value">{{ highReadingsCount }}</div>
      </div>

      <div class="summary-item">
        <div class="label">Medication Taken</div>
        <div class="value">
          {{ medicationTakenCount }}
          {{ medicationTakenCount === 1 ? 'time' : 'times' }}
        </div>
      </div>
    </div>
  </div>
</template>