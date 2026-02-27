<script setup>
import { computed, ref } from 'vue'
import { useUserStore } from '@/stores/useUserStore'
import WeeklySummaryCard from '@/components/WeeklySummaryCard.vue'

const userStore = useUserStore()
const selectedRange = ref(7)
const showHeartRate = ref(false)

const filteredReadings = computed(() => {
  const now = new Date()
  const cutoff = new Date()
  cutoff.setDate(now.getDate() - selectedRange.value)

  return userStore.readings
    .filter((r) => {
      const date = new Date(r.reading_time)
      return date >= cutoff && date <= now
    })
    .sort((a, b) => new Date(a.reading_time) - new Date(b.reading_time))
})

const availableDaysInRange = computed(() => {
  if (!filteredReadings.value.length) return 0

  const first = new Date(filteredReadings.value[0].reading_time)
  const last = new Date(filteredReadings.value.at(-1).reading_time)

  const diffMs = last - first
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  return diffDays + 1
})

const isPartialRange = computed(() => {
  return availableDaysInRange.value < selectedRange.value
})

const partialRangeMessage = computed(() => {
  if (!isPartialRange.value) return null

  return `${selectedRange.value}-day view selected — showing ${availableDaysInRange.value} days of available data.`
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

const chartSeries = computed(() => {
  const baseSeries = [
    {
      name: 'Systolic',
      data: filteredReadings.value.map((r) => r.systolic),
    },
    {
      name: 'Diastolic',
      data: filteredReadings.value.map((r) => r.diastolic),
    },
  ]

  if (showHeartRate.value) {
    baseSeries.push({
      name: 'Heart Rate',
      data: filteredReadings.value.map((r) => r.heart_rate),
    })
  }

  return baseSeries
})

const chartOptions = computed(() => ({
  chart: {
    type: 'line',
    toolbar: { show: false },
  },
  stroke: {
    curve: 'smooth',
    width: 3,
  },
  xaxis: {
    categories: filteredReadings.value.map((r) => new Date(r.reading_time).toLocaleDateString()),
  },
  yaxis: {
    min: 50,
    max: 200,
  },
  annotations: {
    yaxis: [
      {
        y: avgSystolic.value,
        borderColor: '#ff6b6b',
        strokeDashArray: 6,
        label: {
          text: 'Avg Systolic',
          style: { background: '#ff6b6b', color: '#fff' },
        },
      },
      {
        y: avgDiastolic.value,
        borderColor: '#4f7cff',
        strokeDashArray: 6,
        label: {
          text: 'Avg Diastolic',
          style: { background: '#4f7cff', color: '#fff' },
        },
      },
    ],
  },
  tooltip: {
    shared: true,
    intersect: false,
  },
}))
</script>

<template>
  <main>
    <div class="privacy-container">
      <h1>Track My BP</h1>
      <h2>Insights and Reports</h2>
    </div>

    <!-- Toggle First -->
    <div class="range-toggle">
      <button :class="{ active: selectedRange === 7 }" @click="selectedRange = 7">7 Days</button>

      <button :class="{ active: selectedRange === 30 }" @click="selectedRange = 30">30 Days</button>

      <button :class="{ active: selectedRange === 90 }" @click="selectedRange = 90">90 Days</button>
    </div>

    <div v-if="partialRangeMessage" class="data-note">
      {{ partialRangeMessage }}
    </div>

    <!-- Summary (driven by selectedRange) -->
    <WeeklySummaryCard v-if="userStore.user" :readings="userStore.readings" :days="selectedRange" />

    <!-- Trend Chart -->
    <label class="toggle-hr">
      <input type="checkbox" v-model="showHeartRate" />
      Show Heart Rate
    </label>
    <apexchart type="line" height="350" :options="chartOptions" :series="chartSeries" />
  </main>
</template>

<style scoped>
.range-toggle {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.range-toggle button {
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
}

.range-toggle button.active {
  background: #4f7cff;
  color: white;
  border-color: #4f7cff;
}

.data-note {
  font-size: 0.85rem;
  color: #666;
  margin-top: 8px;
}
</style>
