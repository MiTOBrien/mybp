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

      <!-- 3 Column Section -->
      <div class="footer-grid">
        <!-- Column 1: Venmo -->
        <div class="footer-column donation">
          <p class="column-title">Support Development</p>
          <a href="https://venmo.com/michael-obrien-970" target="_blank" rel="noopener">
            <img src="/venmo.png" alt="Venmo QR Code" />
          </a>
          <p class="donation-caption">Scan/Tap/Click to donate via Venmo</p>
        </div>

        <!-- Column 2: Educational -->
        <div class="footer-column">
          <p class="column-title">Learn</p>
          <RouterLink to="/hbp-causes">Causes of High Blood Pressure</RouterLink>
          <RouterLink to="/hbp-management">Managing High Blood Pressure</RouterLink>
        </div>

        <!-- Column 3: Legal -->
        <div class="footer-column">
          <p class="column-title">Legal</p>
          <RouterLink to="/tos">Terms of Service</RouterLink>
          <RouterLink to="/privacy-policy">Privacy Policy</RouterLink>
        </div>
      </div>

      <p class="veteran-note">Created and maintained by a U.S. military veteran.</p>

      <p class="copyright">© {{ new Date().getFullYear() }} Track My BP. All rights reserved.</p>
    </div>
  </footer>
</template>

<style scoped></style>
