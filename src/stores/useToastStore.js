import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useToastStore = defineStore('toast', () => {
  const message = ref('')
  const type = ref('success') // success | error | info
  const visible = ref(false)
  let timeoutId = null

  function show(msg, t = 'success', duration = 3000) {
    message.value = msg
    type.value = t
    visible.value = true

    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      visible.value = false
    }, duration)
  }

  return { message, type, visible, show }
})
