<template>
  <div class="category-manager">
    <h2>Управление категориями</h2>

    <!-- Форма для добавления новой категории -->
    <form @submit.prevent="addCategory">
      <input v-model="newCategoryAlias" placeholder="Alias новой категории" />
      <input v-model="newCategoryName" placeholder="Название новой категории" />
      <button type="submit">Добавить категорию</button>
    </form>

    <!-- Список категорий -->
    <ul>
      <li v-for="category in categories" :key="category._id">
        {{ category.name }}
        <button @click="deleteCategory(category._id)">Удалить</button>
      </li>
    </ul>

    <!-- Сообщение об ошибке -->
    <p v-if="errorMessage">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useFetch } from "#app"; // Для выполнения запросов

const categories = ref([]);
const newCategoryName = ref("");
const newCategoryAlias = ref("");
const errorMessage = ref("");

// Функция для загрузки списка категорий
const loadCategories = async () => {
  try {
    const { data } = await useFetch("/api/categories");
    categories.value = data.value;
    errorMessage.value = ""; // Сбрасываем сообщение об ошибке
  } catch (error) {
    console.error("Ошибка при получении категорий:", error);
    errorMessage.value = "Не удалось загрузить список категорий";
  }
};

// Функция для добавления новой категории
const addCategory = async () => {
  if (!newCategoryAlias.value && !newCategoryName.value) return;

  try {
    await $fetch("/api/categories", {
      method: "POST",
      body: { name: newCategoryName.value, alias: newCategoryAlias.value },
    });
    newCategoryName.value = "";
    newCategoryAlias.value = "";
    await loadCategories(); // Обновляем список категорий
  } catch (error) {
    console.error("Ошибка при добавлении категории:", error);
    errorMessage.value = "Не удалось добавить категорию";
  }
};

// Функция для удаления категории
const deleteCategory = async (id) => {
  try {
    await $fetch(`/api/categories/${id}`, {
      method: "DELETE",
    });
    await loadCategories(); // Обновляем список категорий
  } catch (error) {
    console.error("Ошибка при удалении категории:", error);
    errorMessage.value = "Не удалось удалить категорию";
  }
};

// Загружаем список категорий при монтировании компонента
onMounted(loadCategories);
</script>

<style scoped>
.category-manager {
  max-width: 400px;
  margin: 0 auto;
}

button {
  margin-left: 10px;
  background-color: red;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
}
</style>
