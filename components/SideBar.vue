<template>
  <ul class="sidebar">
    <li v-if="data" v-for="item in data" class="sidebar-item">
      <NuxtLink :to="`/catalog/${item.alias}`" class="sidebar-item__link">{{
        item.name
      }}</NuxtLink>
    </li>
    <p v-else>some text</p>
  </ul>
</template>

<script setup>
const { data } = useFetch("/api/categories");
</script>

<style lang="scss" scoped>
.sidebar {
  width: 300px;
  height: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px 8px;
  border-radius: 5px;
  @include shadow-light;
  &-item {
    &__link {
      display: block;
      width: 100%;
      padding: 15px 20px;
      text-decoration: none;
      color: $primary-text-color;
      font-weight: $font-weight-medium;
      &:hover {
        color: $primary-color;
      }
    }
  }
}
</style>
