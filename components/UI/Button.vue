<template>
    <button :class="props.class">
        <slot></slot>
    </button>
</template>

<script setup>
const props = defineProps({
    class: String
});
</script>

<style lang="scss">
.button {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 8px 44px;
    background: $primary-color;
    color: $white-color;
    border-radius: 4px;
    font-size: $font-size-base;
    @include shadow($black-color, 0.25);
    transition: 0.3s;

    @media (max-width: 747px) {
        padding: 4px 22px;
        font-size: $font-size-small;
    }

    &:hover {
        background: $primary-color-hover;
        box-shadow: none;
    }
    @media (hover: none) {
        &:active {
            background: $primary-color-hover;
            box-shadow: none;
        }
    }
}

.delete-button {
    position: absolute;
    top: 5px;
    right: 5px;
    background-color: red;
    color: white;
    border: none;
    padding: 5px;
    cursor: pointer;
    font-size: 12px;
}

.delete-button:hover {
    background-color: darkred;
}
</style>
