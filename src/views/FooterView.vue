<script setup></script>

<template>
  <footer class="footer">
    <div class="footer-content">
      <p class="disclaimer">
        Track My BP is for informational purposes only and does not provide medical advice.
        Always consult a healthcare professional regarding any health concerns.
      </p>

      <p class="copyright">
        © {{ new Date().getFullYear() }} Track My BP. All rights reserved.
      </p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  padding: 2rem 1rem;
  text-align: center;
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  margin-top: 3rem;
  border-top: 1px solid var(--color-border);
}

.disclaimer {
  max-width: 600px;
  margin: 0 auto 1rem auto;
  line-height: 1.5;
  font-size: 0.85rem;
  opacity: 0.9;
}

.copyright {
  font-size: 0.85rem;
  opacity: 0.7;
}
</style>
