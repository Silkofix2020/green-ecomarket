<template>
  <div class="container">
    <slot></slot>
  </div>
</template>

<script setup></script>

<style lang="scss">
.container {
  margin: 0 auto;
  width: 100%;
  max-width: 1200px;
  padding: 20px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
