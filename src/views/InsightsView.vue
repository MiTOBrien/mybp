<script setup>
import { useUserStore } from '@/stores/useUserStore'
import WeeklySummaryCard from '@/components/WeeklySummaryCard.vue'

const userStore = useUserStore()
</script>

<template>
  <main>
    <div class="privacy-container">
      <h1>Track My BP</h1>
      <h2>Insights and Reports</h2>
    </div>
    <WeeklySummaryCard v-if="userStore.user" :readings="userStore.readings" :days="7" />
    <WeeklySummaryCard :readings="userStore.readings" :days="30" />
  </main>
</template>

<style scoped></style>
