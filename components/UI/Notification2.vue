<template>
  <transition name="custom-fade">
    <div v-if="visible" class="notification" :class="type">
      {{ message }}
    </div>
  </transition>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: "success", // or 'error'
  },
});

const visible = ref(false);

watch(
  () => props.message,
  (newMessage) => {
    if (newMessage) {
      visible.value = true;
      setTimeout(() => {
        visible.value = false;
      }, 3000); // Notification will disappear after 3 seconds
    }
  }
);
</script>

<style scoped>
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px;
  border-radius: 5px;
  color: white;
  z-index: 1000;
}

.notification.success {
  background-color: green;
}

.notification.error {
  background-color: red;
}

.custom-fade-leave-to,
.custom-fade-enter-from {
  opacity: 0;
  transform: translateX(20px);
}
.custome-fade-leave-from,
.custome-fade-enter-to {
  opacity: 1;
  transform: translateX(-20px);
}

.custom-fade-leave-active,
.custom-fade-enter-active {
  transition: transform 0.5s, opacity 0.5s;
}
</style>
