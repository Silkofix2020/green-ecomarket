<template>
    <form @submit.prevent="addProduct" enctype="multipart/form-data">
        <Input v-model="product.alias" placeholder="Алиас" />
        <Input v-model="product.name" placeholder="Название" />
        <Input v-model="product.sku" placeholder="Артикул" />
        <textarea
            v-model="product.description"
            placeholder="Описание"
        ></textarea>
        <textarea
            v-model="product.short_description"
            placeholder="Короткое описание"
        ></textarea>
        <Input v-model="product.price" placeholder="Цена: 1000" />
        <Input
            v-model="product.category"
            placeholder="Номер категории"
            type="number"
        />
        <Input v-model="product.flags" placeholder="Flags (comma separated)" />

        <!-- Поле для загрузки основного изображения -->
        <input type="file" @change="onFileChange" accept="image/*" />

        <!-- Поле для загрузки альтернативных изображений (можно выбрать несколько) -->
        <input
            type="file"
            multiple
            @change="onAltImagesChange"
            accept="image/*"
        />

        <Button class="button" type="submit">Добавить продукт</Button>
    </form>
</template>

<script setup>
import { ref } from "vue";
import Input from "../UI/Input.vue";
import Button from "../UI/Button.vue";

// Поля формы
const product = ref({
    alias: "",
    name: "",
    sku: "",
    description: "",
    short_description: "",
    price: 0,
    category: 0,
    flags: ""
});

const imageFile = ref(null);
const altImages = ref([]); // Хранит массив альтернативных изображений

// Обработка изменения основного изображения
const onFileChange = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
        imageFile.value = files[0];
    } else {
        imageFile.value = null;
    }
};

// Обработка изменения альтернативных изображений
const onAltImagesChange = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
        altImages.value = Array.from(files); // Сохраняем все выбранные файлы
    } else {
        altImages.value = [];
    }
};

const addProduct = async () => {
    // Подготовка данных формы для отправки
    const flags = product.value.flags
        ? product.value.flags.split(",").map((flag) => flag.trim())
        : [];

    const formData = new FormData();
    formData.append("alias", product.value.alias);
    formData.append("name", product.value.name);
    formData.append("sku", product.value.sku);
    formData.append("description", product.value.description);
    formData.append("short_description", product.value.short_description);
    formData.append("price", product.value.price);
    formData.append("category", product.value.category);
    formData.append("flags", JSON.stringify(flags));

    // Добавляем основное изображение в formData
    if (imageFile.value) {
        formData.append("image", imageFile.value);
    }

    // Добавляем альтернативные изображения в formData
    if (altImages.value.length > 0) {
        altImages.value.forEach((file, index) => {
            formData.append(`alternative_images`, file);
        });
    }

    try {
        const response = await fetch("/api/products/add-product", {
            method: "POST",
            body: formData
        });

        const result = await response.json();
        if (result.success) {
            alert("Продукт успешно добавлен");
            // Очистка формы
            product.value = {
                alias: "",
                name: "",
                sku: "",
                description: "",
                short_description: "",
                price: 0,
                category: 0,
                flags: ""
            };
            imageFile.value = null;
            altImages.value = [];
        } else {
            alert("Ошибка при добавлении продукта: " + result.error);
        }
    } catch (error) {
        console.error("Ошибка при отправке формы:", error);
    }
};

watch(
    () => product.value.name,
    (newName) => {
        if (newName) {
            product.value.alias = formattedStringToSlug(newName);
        }
    }
);
</script>

<style></style>
