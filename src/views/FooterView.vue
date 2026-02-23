<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <footer class="footer">
    <div class="footer-content">
      <p class="disclaimer">
        Track My BP is for informational purposes only and does not provide medical advice. Always
        consult a healthcare professional regarding any health concerns.
      </p>
      
      <div class="reference-links">
      <RouterLink to="/hbp-causes">Causes of High Blood Pressure</RouterLink>
      <span class="divider">•</span>
      <RouterLink to="/hbp-management">Managing High Blood Pressure</RouterLink>
      </div>

      <div class="legal-links">
        <RouterLink to="/tos">Terms of Service</RouterLink>
        <span class="divider">•</span>
        <RouterLink to="/privacy-policy">Privacy Policy</RouterLink>
      </div>

      <p class="copyright">© {{ new Date().getFullYear() }} Track My BP. All rights reserved.</p>
    </div>
  </footer>
</template>

<style scoped></style>
