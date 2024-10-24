<template>
    <div :class="props.class">
        <textarea
            v-if="textArea"
            class="product-view__group-textarea"
            v-model="inputValue"
            :type="inputType"
            :disabled="isDisable"
            @input="updateValue"
        ></textarea>
        <input
            v-else
            class="product-view__group-input"
            v-model="inputValue"
            :type="inputType"
            :disabled="isDisable"
            @input="updateValue"
        />
        <div
            :class="[
                'product-view__group-icon',
                { 'product-view__group-icon--active': !isDisable }
            ]"
            @click="toggle"
        >
            <img
                :src="
                    isDisable
                        ? '/img/ui/heroicons--pencil-square.svg'
                        : '/img/ui/ph--check-square.svg'
                "
                alt="pencil"
            />
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
    product: {
        type: Object,
        required: true
    },
    field: {
        type: String,
        required: true
    },
    type: {
        type: String,
        default: "text"
    },
    textArea: {
        type: Boolean,
        default: false
    },
    class: String
});

const emit = defineEmits(["update"]);

const textArea = ref(props.textArea);
const inputValue = ref(props.product[props.field]);
const isDisable = ref(true);

const inputType = ref(props.type);

const toggle = () => {
    isDisable.value = !isDisable.value;
    if (isDisable.value) {
        emit("update", { field: props.field, value: inputValue.value });
    }
};

const updateValue = (event) => {
    if (props.type === "number") {
        inputValue.value = Number(event.target.value);
    } else if (props.type === "boolean") {
        inputValue.value = event.target.value === "true";
    } else {
        inputValue.value = event.target.value;
    }
};

watch(
    () => props.product[props.field],
    (newValue) => {
        inputValue.value = newValue;
    }
);
</script>

<style></style>
