<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <footer class="footer">
    <div class="footer-content">
      <!-- Disclaimer -->
      <p class="disclaimer">
        Track My BP is for informational purposes only and does not provide medical advice. Always
        consult a healthcare professional regarding any health concerns.
      </p>

      <!-- Educational Links -->
      <div class="reference-links">
        <RouterLink to="/hbp-causes">Causes of High Blood Pressure</RouterLink>
        <span class="divider">•</span>
        <RouterLink to="/hbp-management">Managing High Blood Pressure</RouterLink>
      </div>

      <!-- Legal Links -->
      <div class="legal-links">
        <RouterLink to="/tos">Terms of Service</RouterLink>
        <span class="divider">•</span>
        <RouterLink to="/privacy-policy">Privacy Policy</RouterLink>
      </div>

      <!-- Donation Section -->
      <div class="donation-section">
        <p class="donation-text">
          If you find this app helpful and would like to support continued development:
        </p>
        <img src="/venmo.png" alt="Venmo QR Code" />
      </div>

      <p class="copyright">© {{ new Date().getFullYear() }} Track My BP. All rights reserved.</p>
    </div>
  </footer>
</template>

<style scoped></style>
