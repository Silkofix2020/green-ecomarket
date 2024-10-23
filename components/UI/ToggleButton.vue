<template>
  <button
    :class="['toggle-button', { 'toggle-button--active': localIsActive }]"
    @click="toggle"
    type="button"
  >
    <div class="toggle-button__circle">
      <span v-if="localIsActive" class="toggle-button__check">✔</span>
      <span v-else class="toggle-button__cross">✖</span>
    </div>
  </button>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  isActive: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["update:isActive"]);

const localIsActive = ref(props.isActive);

const toggle = () => {
  localIsActive.value = !localIsActive.value;
  emit("update:isActive", localIsActive.value);
};

watch(
  () => props.isActive,
  (newValue) => {
    localIsActive.value = newValue;
  }
);
</script>
<style lang="scss">
.toggle-button {
  width: 42px;
  height: 22px;
  background-color: $primary-color-non-active;
  border: none;
  border-radius: 10px;
  position: relative;
  cursor: pointer;
  transition: background-color 0.3s;
  outline: none;
  padding: 0;
  &__text {
    font-size: 12px;
  }
}

.toggle-button--active {
  background-color: $primary-color;
}

.toggle-button__circle {
  width: 18px;
  height: 18px;
  background-color: #fff;
  border-radius: 50%;
  position: absolute;
  top: 2px;
  left: 2px;
  transition: left 0.3s;
}

.toggle-button--active .toggle-button__circle {
  left: 22px;
}

.toggle-button__check,
.toggle-button__cross {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 16px;
  color: $primary-color-non-active;
}
.toggle-button__check {
  color: $primary-color;
}
</style>
