<script setup>
import { useUserStore } from '@/stores/useUserStore'
import BloodPressureModal from '@/components/BloodPressureModal.vue'

const userStore = useUserStore()

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

  <!-- BP Modal -->
  <BloodPressureModal v-if="userStore.showBpModal" @close="userStore.showBpModal = false" />
</template>

<style scoped></style>
