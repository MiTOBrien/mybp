<script setup>
import { useToastStore } from '@/stores/useToastStore'
const toast = useToastStore()
</script>

<template>
  <transition name="toast-fade">
    <div v-if="toast.visible" class="toast" :class="toast.type">
      {{ toast.message }}
    </div>
  </transition>
</template>

<style scoped>
.toast {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: #333;
  color: white;
  padding: 12px 18px;
  border-radius: 6px;
  font-size: 0.9rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
  z-index: 9999;
  opacity: 0.95;
}

.toast.success {
  background: #2e7d32;
}
.toast.error {
  background: #c62828;
}
.toast.info {
  background: #1565c0;
}

.toast-fade-enter-active,
.toast-fade-leave-active {
  transition:
    opacity 0.3s,
    transform 0.3s;
}

.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
