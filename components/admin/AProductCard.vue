<template>
  <div class="product-view__content">
    <!-- Отображение изображения продукта -->
    <div class="product-view__images">
      <!-- Основное изображение -->
      <div class="product-view__main-image">
        <NuxtImg
          class="product-view__poster"
          :src="product.image_url"
          format="webp"
          alt="img"
          loading="lazy"
        />
        <button
          v-if="product.image_url"
          @click="deleteImage(product.image_url, 'main')"
          class="delete-button"
        >
          Удалить основное изображение
        </button>
      </div>

      <!-- Альтернативные изображения -->
      <div class="product-view__alternative-images">
        <div
          v-for="(image, index) in product.alternative_images"
          :key="index"
          class="product-view__alternative-image-wrapper"
        >
          <NuxtImg
            class="product-view__alternative-image"
            :src="image"
            format="webp"
            alt="alternative image"
            loading="lazy"
          />
          <button
            @click="deleteImage(image, 'alternative')"
            class="delete-button"
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
    <!-- Редактирование полей продукта -->
    <div class="product-view__edit">
      <div
        class="product-view__item"
        v-for="field in editableFields"
        :key="field"
      >
        <h5 class="product-view__item-title">{{ field.label }}:</h5>
        <EditInput
          :product="product"
          :field="field.name"
          :type="field.type || 'text'"
          class="product-view__group"
          @update="updateProductField"
        />
      </div>
      <!-- Загрузка изображений -->
      <div class="product-view__item">
        <h5 class="product-view__item-title">Основное изображение:</h5>
        <input type="file" @change="onMainImageSelected" accept="image/*" />
      </div>
      <div class="product-view__item">
        <h5 class="product-view__item-title">Альтернативные изображения:</h5>
        <input
          type="file"
          multiple
          @change="onAlternativeImagesSelected"
          accept="image/*"
        />
      </div>
    </div>
  </div>
  <Button @click="handleSaveProduct">Сохранить</Button>

  <!-- Кнопка для удаления продукта -->
  <Button @click="confirmDeleteProduct" class="delete-button">
    Удалить продукт
  </Button>

  <!-- Уведомления -->
  <Notification
    v-if="notificationMessage"
    :message="notificationMessage"
    :type="notificationType"
  />
</template>

<script setup>
import { ref } from "vue";
import EditInput from "../components/UI/EditInput.vue";
import Button from "../components/UI/Button.vue";
import {
  saveProduct,
  deleteProductImage,
  deleteProduct,
} from "../utils/productActions";
import { useNotification } from "../composables/useNotification";

const props = defineProps({
  product: { type: Object, required: true },
  categories: { type: Array, required: true },
});

const emit = defineEmits(["update", "delete"]);
const { notificationMessage, notificationType, setNotification } =
  useNotification();

// Переменные для изображений
const mainImageFile = ref(null);
const alternativeImagesFiles = ref([]);

// Поля для редактирования
const editableFields = [
  { name: "alias", label: "Алиас" },
  { name: "name", label: "Наименование" },
  { name: "description", label: "Описание" },
  { name: "price", label: "Цена", type: "number" },
  { name: "sku", label: "Артикул" },
];

// Обновление данных продукта
const updateProductField = ({ field, value }) => {
  emit("update", { field, value, id: props.product._id });
};

// Обработчик выбора изображений
const onMainImageSelected = (event) => {
  mainImageFile.value = event.target.files[0];
  console.log("Main image selected:", mainImageFile.value);
};

const onAlternativeImagesSelected = (event) => {
  alternativeImagesFiles.value = Array.from(event.target.files);
  console.log("Alternative images selected:", alternativeImagesFiles.value);
};

// Сохранение продукта
const handleSaveProduct = async () => {
  const formData = new FormData();

  // Добавляем поля продукта
  if (props.product._id) {
    formData.append("_id", props.product._id);
  }
  for (const key in props.product) {
    formData.append(key, props.product[key]);
  }

  // Добавляем изображения
  if (mainImageFile.value) {
    formData.append("image", mainImageFile.value);
  }
  alternativeImagesFiles.value.forEach((file, index) => {
    formData.append(`alternative_images_${index}`, file);
  });

  const result = await saveProduct(formData);
  if (result.success) {
    setNotification("Продукт обновлен!", "success");
  } else {
    setNotification("Ошибка обновления продукта!", "error");
  }
};

// Удаление продукта
const confirmDeleteProduct = async () => {
  const isConfirmed = confirm("Вы уверены, что хотите удалить этот продукт?");
  if (isConfirmed) {
    const result = await deleteProduct(props.product._id);
    if (result.success) {
      setNotification("Продукт успешно удалён!", "success");
      emit("delete", props.product._id); // Отправляем событие удаления
    } else {
      setNotification(`Ошибка удаления продукта: ${result.error}`, "error");
    }
  }
};

// Функция для удаления изображений
const deleteImage = async (imageUrl, imageType) => {
  try {
    const result = await deleteProductImage(
      props.product._id,
      imageUrl,
      imageType
    );
    if (result.success) {
      setNotification("Изображение успешно удалено", "success");
      // Удаляем изображение из локального состояния
      if (imageType === "main") {
        props.product.image_url = "";
      } else if (imageType === "alternative") {
        props.product.alternative_images =
          props.product.alternative_images.filter((img) => img !== imageUrl);
      }
    }
  } catch (error) {
    setNotification("Ошибка при удалении изображения", "error");
  }
};
</script>

<style lang="scss">
.product-view {
  &__content {
    width: 100%;
    max-width: 1358px;
    display: flex;
    border-top: 1px solid $primary-color;
    padding: 10px 0;

    @media (max-width: 740px) {
      flex-direction: column;
    }
  }
  &__images {
    width: 50%;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  &__poster {
    width: 200px;
    border: 1px solid rgba($color: $border-input-color, $alpha: 0.3);
  }

  &__main-image {
    width: 100%;
    display: flex;
    justify-content: center;
  }
  &__alternative-images {
    width: 100%;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 5px;
  }
  &__alternative-image {
    width: 20%;
    padding: 5px;
    border: 1px solid rgba($color: $border-input-color, $alpha: 0.3);
  }

  &__edit {
    width: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
  &__item {
    width: 100%;
    max-width: 400px;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  &__group {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 8px;

    &-input {
      width: 100%;
      padding: 6px 17px;
      border-radius: 5px;
      border: $input-border;
      box-sizing: border-box; // добавлено
      &:disabled {
        cursor: not-allowed;
        opacity: 0.75;
        user-select: none;
      }
    }
    &-textarea {
      position: relative;
      display: block;
      width: 100%;
      max-width: 400px; // добавлено
      height: 200px;
      box-sizing: border-box; // добавлено
      &:disabled {
        cursor: not-allowed;
        opacity: 0.75;
      }
      &:focus {
        outline: none;
      }
      border: 0;
      border-radius: 0.375rem; // rounded-md
      &::placeholder {
        color: #9ca3af; // placeholder-gray-400
      }
      &.dark::placeholder {
        color: #6b7280; // dark:placeholder-gray-500
      }
      font-size: 0.875rem; // text-sm
      padding: 0.375rem 0.625rem; // px-2.5 py-1.5
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); // shadow-sm
      background-color: #ffffff; // bg-white
      &.dark {
        background-color: #111827; // dark:bg-gray-900
      }
      color: #111827; // text-gray-900
      &.dark {
        color: #ffffff; // dark:text-white
      }
      box-sizing: border-box;
      border: 1px solid;
      border-color: #d1d5db; // ring-gray-300
      &.dark {
        border-color: #374151; // dark:ring-gray-700
      }
      &:focus {
        border-width: 2px; // focus:ring-2
        border-color: #3b82f6; // focus:ring-primary-500
      }
      &.dark:focus {
        border-color: #60a5fa; // dark:focus:ring-primary-400
      }
      resize: none;
    }
    &-icon {
      width: 32px;
      height: 32px;
      background-color: $primary-color;
      border-radius: 5px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      user-select: none;

      &--active {
        background-color: $white-color;
        border: 1px solid $border-color;
      }

      &:hover {
        box-shadow: 0 0 5px 0 rgba($color: #000000, $alpha: 0.3);
      }

      & img {
        width: 20px;
      }
    }
  }
}
.colors-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.color-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.color-box {
  width: 35px;
  height: 35px;
  border: 1px solid $border-color;
  border-radius: 5px;
}

.color-input {
  width: 100%;
  max-width: 100px;
}

.new-color {
  display: flex;
  align-items: center;
  gap: 10px;

  &-input {
    max-width: 100%;
    & input {
      width: 100px;
    }
  }
}
.color-delete {
  width: 20px;
  cursor: pointer;
}
.product-view__images {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.product-view__main-image {
  position: relative;
  max-width: 100%;
}

.product-view__poster {
  width: 100%;
  object-fit: cover;
}

.product-view__alternative-images {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.product-view__alternative-image-wrapper {
  position: relative;
}

.product-view__alternative-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
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
