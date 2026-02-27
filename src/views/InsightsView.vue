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

const trendDirection = computed(() => {
  const readings = filteredReadings.value
  if (readings.length < 4) return null

  const segmentSize = Math.floor(readings.length / 4)

  const firstSegment = readings.slice(0, segmentSize)
  const lastSegment = readings.slice(-segmentSize)

  const firstAvg = firstSegment.reduce((acc, r) => acc + r.systolic, 0) / firstSegment.length

  const lastAvg = lastSegment.reduce((acc, r) => acc + r.systolic, 0) / lastSegment.length

  const diff = lastAvg - firstAvg

  if (diff > 3) return 'up'
  if (diff < -3) return 'down'
  return 'stable'
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
    max: 210,
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

const morningReadings = computed(() => {
  return filteredReadings.value.filter((r) => {
    const hour = new Date(r.reading_time).getHours()
    return hour >= 4 && hour < 12
  })
})

const eveningReadings = computed(() => {
  return filteredReadings.value.filter((r) => {
    const hour = new Date(r.reading_time).getHours()
    return hour >= 16 && hour <= 23
  })
})

const avgMorningSystolic = computed(() => {
  if (!morningReadings.value.length) return null
  const sum = morningReadings.value.reduce((acc, r) => acc + r.systolic, 0)
  return Math.round(sum / morningReadings.value.length)
})

const avgEveningSystolic = computed(() => {
  if (!eveningReadings.value.length) return null
  const sum = eveningReadings.value.reduce((acc, r) => acc + r.systolic, 0)
  return Math.round(sum / eveningReadings.value.length)
})

const morningEveningDiff = computed(() => {
  if (!avgMorningSystolic.value || !avgEveningSystolic.value) return null
  return avgEveningSystolic.value - avgMorningSystolic.value
})

const morningEveningInsight = computed(() => {
  if (morningEveningDiff.value === null) return null

  const diff = morningEveningDiff.value

  if (Math.abs(diff) < 3) {
    return 'Morning and evening blood pressure are generally consistent.'
  }

  if (diff > 0) {
    return `Evening systolic averages ${diff} mmHg higher than morning.`
  }

  return `Morning systolic averages ${Math.abs(diff)} mmHg higher than evening.`
})
</script>

<template>
  <main>
    <div class="privacy-container">
      <h1>Insights and Reports</h1>
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
    <h3 class="section-title">Summary</h3>
    <WeeklySummaryCard v-if="userStore.user" :readings="filteredReadings" :days="selectedRange" />

    <!-- Morning vs Evening Insight -->
    <h3 class="section-title">Morning vs Evening</h3>
    <div v-if="morningEveningInsight" class="insight-card">
      <p>{{ morningEveningInsight }}</p>

      <div class="insight-details">
        <span v-if="avgMorningSystolic">Morning Avg: {{ avgMorningSystolic }} mmHg</span>
        <span v-if="avgEveningSystolic">Evening Avg: {{ avgEveningSystolic }} mmHg</span>
      </div>
    </div>

    <!-- Trend Chart -->
    <h3 class="section-title">Blood Pressure Trends</h3>
    <label class="toggle-hr">
      <input type="checkbox" v-model="showHeartRate" />
      Show Heart Rate
    </label>

    <div v-if="trendDirection" class="trend-badge">
      <span v-if="trendDirection === 'up'">⬆ Trending Up</span>
      <span v-else-if="trendDirection === 'down'">⬇ Trending Down</span>
      <span v-else>→ Stable</span>
    </div>

    <apexchart type="line" height="350" :options="chartOptions" :series="chartSeries" />
  </main>
</template>

<style scoped>
.range-toggle {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.range-toggle button {
  padding: 8px 14px;
  border-radius: 10px;
  border: 1px solid #d6ddff;
  background: #f5f7ff;
  color: #2a2a2a;
  cursor: pointer;
  transition: 0.2s;
}

.range-toggle button.active {
  background: #4f7cff;
  color: white;
  border-color: #4f7cff;
}

.section-title {
  margin: 24px 0 8px;
  font-size: 1.1rem;
  color: #2a2a2a;
  font-weight: 600;
}

.data-note {
  font-size: 0.85rem;
  color: #6b6b6b;
  margin-top: 6px;
}

.trend-badge {
  margin: 12px 0;
  font-weight: 600;
  color: #4f7cff;
}

.insight-card {
  background: #f5f7ff;
  border: 1px solid #d6ddff;
  border-radius: 14px;
  padding: 18px;
  margin-bottom: 20px;
}

.insight-card h3 {
  margin-bottom: 8px;
  color: #2a2a2a;
}

.insight-details {
  margin-top: 10px;
  font-size: 0.9rem;
  color: #6b6b6b;
  display: flex;
  gap: 20px;
}

.toggle-hr {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 12px 0;
  font-size: 0.9rem;
  color: #2a2a2a;
}
</style>
