<template>
  <div class="product-view__content">
    <NuxtImg
      class="product-view__poster"
      :src="product.image_url"
      format="webp"
      alt="img"
    />
    <div class="product-view__edit">
      <div class="product-view__item">
        <h5 class="product-view__item-title">Алиас:</h5>
        <EditInput
          :product="product"
          field="alias"
          class="product-view__group"
          @update="updateProductField"
        />
      </div>
      <div class="product-view__item">
        <h5 class="product-view__item-title">Наименование:</h5>
        <EditInput
          :product="product"
          field="name"
          class="product-view__group"
          @update="updateProductField"
        />
      </div>
      <div class="product-view__item">
        <h5 class="product-view__item-title">Категория:</h5>
        <select
          v-model="selectedCategory"
          @change="updateCategory"
          class="product-view__group"
        >
          <option
            v-for="category in categories"
            :key="category._id"
            :value="category.alias"
          >
            {{ category.alias }}
          </option>
        </select>
      </div>
      <div class="product-view__item">
        <h5 class="product-view__item-title">Описание:</h5>
        <EditInput
          :product="product"
          field="description"
          :isActive="true"
          class="product-view__group"
          @update="updateProductField"
        />
      </div>
      <div class="product-view__item">
        <h5 class="product-view__item-title">Цена:</h5>
        <EditInput
          :product="product"
          field="price"
          type="number"
          class="product-view__group"
          @update="updateProductField"
        />
      </div>
      <div class="product-view__item">
        <h5 class="product-view__item-title">Артикул:</h5>
        <EditInput
          :product="product"
          field="sku"
          class="product-view__group"
          @update="updateProductField"
        />
      </div>
      <div class="product-view__item">
        <h5 class="product-view__item-title">Ссылка на изображение:</h5>
        <EditInput
          :product="product"
          field="image_url"
          class="product-view__group"
          @update="updateProductField"
        />
      </div>
      <div class="product-view__item">
        <h5 class="product-view__item-title">Цвета:</h5>
        <div class="colors-list">
          <div
            v-for="(color, index) in product.colors"
            :key="index"
            class="color-item"
          >
            <div :style="{ backgroundColor: color }" class="color-box"></div>
            <Input
              showLabel
              :customClass="'color-input'"
              v-model="product.colors[index]"
              @input="updateColor(index, product.colors[index])"
              >hex-code</Input
            >
            <img
              class="color-delete"
              src="/img/ui/iconamoon--close.svg"
              alt="delete"
              @click="removeColor(index)"
            />
          </div>
        </div>
        <div class="new-color">
          <Input
            v-model="newColor"
            class="new-color-input"
            placeholder="#000000"
            maxlength="7"
            @input="prependHash"
          />
          <Button @click="addColor">Добавить цвет</Button>
        </div>
      </div>
      <div class="meta-tags">
        <Input v-model="newTag" placeholder="Добавить тег" />
        <Button @click="addTag">Добавить тег</Button>
        <ul>
          <li v-for="(tag, index) in props.product.tags" :key="index">
            {{ tag }} <Button @click="removeTag(index)">Удалить</Button>
          </li>
        </ul>
      </div>
      <Button @click="handleSaveProduct">Сохранить</Button>
    </div>

    <div>
      <NuxtImg
        v-for="(image, index) in product.alternative_images"
        :key="index"
        :src="image"
        format="webp"
        alt="alternative image"
        class="product-view__alternative-image"
      />
    </div>
    <Notification
      v-if="notificationMessage"
      :message="notificationMessage"
      :type="notificationType"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useFetch } from "#app"; // Используем для получения данных с API
import EditInput from "../UI/EditInput.vue";
import Notification from "../components/UI/Notification.vue";
import Button from "../components/UI/Button.vue";
import Input from "../components/UI/Input.vue";
import { saveProduct } from "../utils/productUtils";
import { formattedStringToSlug } from "../utils/formattedStringToSlug";

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
  categories: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["update"]);

const selectedCategory = ref(props.product.category); // Выбранная категория
// const categories = ref([]); // Список категорий

// Загрузка категорий при монтировании компонента
// onMounted(async () => {
//   try {
//     const { data } = await useFetch("/api/categories"); // Запрос списка категорий
//     categories.value = data.value;
//   } catch (error) {
//     console.error("Ошибка при загрузке категорий:", error);
//   }
// });

// Обновление категории продукта при изменении выбора в селекте
const updateCategory = () => {
  emit("update", {
    field: "category",
    value: selectedCategory.value,
    id: props.product._id,
  });
};

const updateProductField = ({ field, value }) => {
  emit("update", { field, value, id: props.product._id });
};

const newColor = ref("#");
const prependHash = () => {
  if (!newColor.value.startsWith("#")) {
    newColor.value = "#" + newColor.value.replace(/^#+/, "");
  }
};

const addColor = () => {
  const hexPattern = /^#[0-9A-F]{6}$/i;
  if (hexPattern.test(newColor.value.trim())) {
    props.product.colors.push(newColor.value.trim());
    newColor.value = "";
  } else {
    console.error("Invalid HEX color code");
  }
};

const updateColor = (index, value) => {
  props.product.colors[index] = value;
};

const removeColor = (index) => {
  props.product.colors.splice(index, 1);
};

const newTag = ref("");
if (!props.product.tags) {
  props.product.tags = [];
}

const addTag = () => {
  const tag = newTag.value.trim();
  if (tag && !props.product.tags.includes(tag)) {
    props.product.tags.push(tag);
    newTag.value = "";
  } else {
    console.error("Invalid or duplicate tag");
  }
};

const removeTag = (index) => {
  props.product.tags.splice(index, 1);
};

const notificationMessage = ref("");
const notificationType = ref("success");

const handleSaveProduct = async () => {
  const result = await saveProduct(props.product);
  if (result.success) {
    notificationMessage.value = "Продукт обновлен!";
    notificationType.value = "success";
  } else {
    notificationMessage.value = "Ошибка обновления продукта!";
    notificationType.value = "error";
  }
};

watch(
  () => props.product.name,
  (newName) => {
    if (newName) {
      const slug = formattedStringToSlug(newName);
      emit("update", { field: "alias", value: slug, id: props.product._id });
    }
  }
);

watch(notificationMessage, (newMessage) => {
  if (newMessage) {
    setTimeout(() => {
      notificationMessage.value = "";
    }, 3000);
  }
});
</script>

<style lang="scss">
.product-view {
  &__content {
    width: 100%;
    max-width: 1358px;
    display: flex;
    border-top: 1px solid $primary-color;
    padding: 10px 0;
    align-items: center;

    @media (max-width: 740px) {
      flex-direction: column;
    }
  }
  &__poster {
    width: 200px;
  }
  &__edit {
    width: 100%;
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
</style>
