<template>
  <transition name="custom-fade" @before-leave="beforeLeave" @leave="leave">
    <div v-if="visible" class="notification" :class="type">
      {{ message }}
      <div class="progress-bar" ref="progressBar"></div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from "vue";

const props = defineProps({
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: "success",
  },
});

const visible = ref(false);
const progressBar = ref(null);

watch(
  () => props.message,
  async (newMessage) => {
    if (newMessage) {
      visible.value = true;
      await nextTick();
      startProgressBar();
      setTimeout(() => {
        visible.value = false;
      }, 3000);
    }
  },
  { flush: "post" }
);

onMounted(async () => {
  if (props.message) {
    visible.value = true;
    await nextTick();
    startProgressBar();
    setTimeout(() => {
      visible.value = false;
    }, 3000);
  }
});

const startProgressBar = () => {
  if (progressBar.value) {
    progressBar.value.style.transition = "none";
    progressBar.value.style.width = "100%";
    requestAnimationFrame(() => {
      progressBar.value.style.transition = "width 3s linear";
      progressBar.value.style.width = "0%";
    });
  }
};

const beforeLeave = (el) => {
  el.style.opacity = "1";
  el.style.transform = "translateY(0)";
};

const leave = (el, done) => {
  el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
  el.style.opacity = "0";
  el.style.transform = "translateY(-20px)";
  setTimeout(done, 500); // Match this time with your transition duration
};
</script>

<style lang="scss">
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px;
  border-radius: 5px 5px 0 0;
  color: white;
  box-shadow: 0 0 10px 1px rgba($color: #000000, $alpha: 0.5);
  z-index: 1000;

  @media (max-width: 767px) {
    top: auto;
    bottom: 20px;
    right: 10px;
    width: auto;
    height: 49px;
  }
}

.notification.success {
  background-color: $primary-color;
}

.notification.error {
  background-color: #d42b2b;
}

.custom-fade-enter-active,
.custom-fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.custom-fade-enter-from,
.custom-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.custom-fade-enter-to,
.custom-fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background-color: rgba(255, 255, 255, 0.9);
  width: 100%;
}

.notification.error .progress-bar {
  background-color: rgb(255, 255, 255);
}
</style>
