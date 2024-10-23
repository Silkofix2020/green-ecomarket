<template>
  <div
    class="input-wrapper"
    :class="{ focused: isFocused, 'has-content': hasContent, customClass }"
  >
    <label v-if="showLabel" :for="id || name">
      <slot />
    </label>
    <input
      :value="modelValue"
      @input="updateValue($event.target.value)"
      @focus="handleFocus"
      @blur="handleBlur"
      :type="type"
      :name="name"
      :placeholder="placeholder"
      :required="required"
      :class="customClass"
      :maxlength="maxlength"
    />
  </div>
</template>

<script setup>
import { watch } from "vue";

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  id: String,
  name: String,
  type: String,
  showLabel: {
    type: Boolean,
    default: false,
  },
  placeholder: String,
  customClass: String,
  required: {
    type: Boolean,
    default: false,
  },
  maxlength: String,
});

const emits = defineEmits(["update:modelValue"]);

const inputValue = ref(props.modelValue);
const isFocused = ref(false);
const hasContent = ref(!!props.modelValue);

const handleFocus = () => {
  isFocused.value = true;
};
const handleBlur = () => {
  isFocused.value = false;
  if (!inputValue.value) {
    hasContent.value = false;
  }
};

const updateValue = (value) => {
  emits("update:modelValue", value);
};

watch(inputValue, (newValue) => {
  hasContent.value = !!newValue;
});
</script>

<style lang="scss">
.input-wrapper {
  position: relative;
  &.focused label,
  &.has-content label {
    top: -10px;
    left: 12px;
    padding: 0 5px;
    background: $white-color;
  }
}
input {
  width: 216px;
  padding: 7px 17px;
  font-size: 16px;
  line-height: 24px;
  border: $input-border;
  color: $black-color;
  border-radius: 5px;
  &::placeholder {
    color: $border-placeholder-color;
  }
  &:active,
  &:focus {
    border-color: $primary-color;
  }
}
label {
  position: absolute;
  top: 12px;
  left: 18px;
  font-size: 14px;
  color: $border-placeholder-color;
}
</style>
