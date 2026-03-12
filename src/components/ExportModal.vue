<script setup>
import { ref, computed, watch } from 'vue'
import { useUserStore } from '@/stores/useUserStore'

// Props from parent (InsightsView.vue)
const props = defineProps({
  modelValue: { type: Boolean, required: true },   // controls modal visibility
  selectedRange: { type: [Number, null], required: true }
})

// Emit updates back to parent
const emit = defineEmits(['update:modelValue', 'update:selectedRange'])

const userStore = useUserStore()

// -----------------------------------------------------
// MODAL VISIBILITY
// -----------------------------------------------------
const showExportModal = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

// -----------------------------------------------------
// SECTION CHECKBOXES
// -----------------------------------------------------
const selectedSections = ref({
  readings: true,            // default ON
  summary: false,
  morningEvening: false,
  categoryDistribution: false,
  trendChart: false
})

// -----------------------------------------------------
// DATE RANGE (mirrors parent selectedRange)
// -----------------------------------------------------
const localRange = ref(props.selectedRange)

// Keep parent in sync when user changes range inside modal
watch(localRange, (val) => {
  emit('update:selectedRange', val)
})

// Keep modal in sync if parent changes range
watch(
  () => props.selectedRange,
  (val) => (localRange.value = val)
)

// -----------------------------------------------------
// FILTER READINGS BY DATE RANGE
// -----------------------------------------------------
function filterByDays(readings, days) {
  if (!days) return readings

  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - days)

  return readings.filter(r => new Date(r.reading_time) >= cutoff)
}

const exportReadings = computed(() => {
  return filterByDays(userStore.allReadings, localRange.value)
})

// -----------------------------------------------------
// DAILY AVERAGES
// -----------------------------------------------------
const dailyAverages = computed(() => {
  const grouped = {}

  exportReadings.value.forEach((r) => {
    const date = r.date
    if (!grouped[date]) {
      grouped[date] = { morning: [], evening: [] }
    }
    if (r.period === 'morning') grouped[date].morning.push(r)
    if (r.period === 'evening') grouped[date].evening.push(r)
  })

  const avg = (arr) => {
    if (!arr.length) return null
    const s = Math.round(arr.reduce((t, r) => t + r.systolic, 0) / arr.length)
    const d = Math.round(arr.reduce((t, r) => t + r.diastolic, 0) / arr.length)
    return `${s}/${d}`
  }

  return Object.keys(grouped)
    .sort((a, b) => new Date(b) - new Date(a))
    .map((date) => {
      const m = grouped[date].morning
      const e = grouped[date].evening
      const all = [...m, ...e]

      return {
        date,
        morningAvg: avg(m),
        morningCount: m.length,
        eveningAvg: avg(e),
        eveningCount: e.length,
        dailyAvg: avg(all)
      }
    })
})

// -----------------------------------------------------
// MORNING VS EVENING SUMMARY
// -----------------------------------------------------
const morningEveningSummary = computed(() => {
  const morning = exportReadings.value.filter(r => r.period === 'morning')
  const evening = exportReadings.value.filter(r => r.period === 'evening')

  const avg = (arr) => {
    if (!arr.length) return null
    const s = Math.round(arr.reduce((t, r) => t + r.systolic, 0) / arr.length)
    const d = Math.round(arr.reduce((t, r) => t + r.diastolic, 0) / arr.length)
    return `${s}/${d}`
  }

  return {
    morningAvg: avg(morning),
    morningCount: morning.length,
    eveningAvg: avg(evening),
    eveningCount: evening.length
  }
})

// -----------------------------------------------------
// CATEGORY DISTRIBUTION
// -----------------------------------------------------
const categoryDistribution = computed(() => {
  const categories = {
    normal: 0,
    elevated: 0,
    stage1: 0,
    stage2: 0,
    crisis: 0
  }

  exportReadings.value.forEach(r => {
    const s = r.systolic
    const d = r.diastolic

    if (s < 120 && d < 80) categories.normal++
    else if (s < 130 && d < 80) categories.elevated++
    else if (s < 140 || d < 90) categories.stage1++
    else if (s < 180 || d < 120) categories.stage2++
    else categories.crisis++
  })

  const total = exportReadings.value.length || 1

  return {
    normal: Math.round((categories.normal / total) * 100),
    elevated: Math.round((categories.elevated / total) * 100),
    stage1: Math.round((categories.stage1 / total) * 100),
    stage2: Math.round((categories.stage2 / total) * 100),
    crisis: Math.round((categories.crisis / total) * 100)
  }
})

// -----------------------------------------------------
// TREND CHART (SYSTOLIC / DIASTOLIC ONLY)
// -----------------------------------------------------
const exportChartSeries = computed(() => [
  {
    name: 'Systolic',
    data: exportReadings.value.map(r => r.systolic)
  },
  {
    name: 'Diastolic',
    data: exportReadings.value.map(r => r.diastolic)
  }
])

const exportChartOptions = computed(() => ({
  chart: { id: 'export-chart', toolbar: { show: false } },
  xaxis: { categories: exportReadings.value.map(r => r.date) },
  stroke: { curve: 'smooth' }
}))

// -----------------------------------------------------
// PRINT HANDLER
// -----------------------------------------------------
function printExport() {
  window.print()
}
</script>

<template>
  <!-- EXPORT MODAL -->
<div v-if="showExportModal" class="export-modal-overlay">
  <div class="export-modal">

    <!-- Header -->
    <header class="export-modal-header">
      <h2>Export / Print Report</h2>
      <button class="close-btn" @click="showExportModal = false">×</button>
    </header>

    <!-- Body -->
    <div class="export-modal-body">

      <!-- DATE RANGE SELECTION -->
      <section class="export-section">
        <h3>Date Range</h3>

        <div class="range-options">
          <label>
            <input type="radio" value="7" v-model="selectedRange" />
            Last 7 Days
          </label>

          <label>
            <input type="radio" value="30" v-model="selectedRange" />
            Last 30 Days
          </label>

          <label>
            <input type="radio" value="90" v-model="selectedRange" />
            Last 90 Days
          </label>

          <label>
            <input type="radio" :value="null" v-model="selectedRange" />
            All Data
          </label>
        </div>
      </section>

      <!-- SECTION CHECKBOXES -->
      <section class="export-section">
        <h3>Include Sections</h3>

        <div class="checkbox-list">
          <label>
            <input type="checkbox" v-model="selectedSections.readings" />
            Daily BP Readings
          </label>

          <label>
            <input type="checkbox" v-model="selectedSections.summary" />
            Summary (Daily Averages)
          </label>

          <label>
            <input type="checkbox" v-model="selectedSections.morningEvening" />
            Morning vs Evening
          </label>

          <label>
            <input type="checkbox" v-model="selectedSections.categoryDistribution" />
            Category Distribution
          </label>

          <label>
            <input type="checkbox" v-model="selectedSections.trendChart" />
            Trend Chart (Systolic / Diastolic)
          </label>
        </div>
      </section>

      <!-- PREVIEW AREA -->
      <section class="export-preview">
        <h3>Preview</h3>

        <!-- Daily Readings -->
        <div v-if="selectedSections.readings">
          <DailyReadingsTable :readings="exportReadings" />
        </div>

        <!-- Summary -->
        <div v-if="selectedSections.summary">
          <DailyAveragesTable :rows="dailyAverages" />
        </div>

        <!-- Morning vs Evening -->
        <div v-if="selectedSections.morningEvening">
          <MorningEveningSummary :summary="morningEveningSummary" />
        </div>

        <!-- Category Distribution -->
        <div v-if="selectedSections.categoryDistribution">
          <CategoryDistributionChart :data="categoryDistribution" />
        </div>

        <!-- Trend Chart -->
        <div v-if="selectedSections.trendChart">
          <apexchart
            type="line"
            height="300"
            :options="exportChartOptions"
            :series="exportChartSeries"
          />
        </div>
      </section>
    </div>

    <!-- Footer -->
    <footer class="export-modal-footer">
      <button class="cancel-btn" @click="showExportModal = false">Cancel</button>
      <button class="print-btn" @click="printExport">Print / Save</button>
    </footer>

  </div>
</div>
</template>