<template>
  <Container>
    <AdminAddForm />
    <div class="product-view">
      <div
        class="product-view__container"
        v-for="product in filteredProducts"
        :key="product._id"
      >
        <DropDown :title="product.name">
          <AProductCard :product="product" @update="updateProductField" />
        </DropDown>
        <div class="product-view__management">
          <ToggleButton
            :isActive="product.flags?.is_enabled ?? false"
            @update:isActive="(newValue) => handleToggle(newValue, product._id)"
          />
        </div>
      </div>
    </div>
    <Notification
      v-if="notificationMessage"
      :message="notificationMessage"
      :type="notificationType"
    />
  </Container>
</template>

<script setup>
definePageMeta({
  layout: "admin",
  middleware: "auth",
});
useHead({
  title: "GM Admin: Fibers",
});
import { ref, onMounted } from "vue";

import AProductCard from "../components/admin/AProductCard.vue";
import AdminAddForm from "../components/admin/AdminAddForm.vue";
import DropDown from "../components/admin/DropDown.vue";
import Container from "../components/UI/Container.vue";
import ToggleButton from "../components/UI/ToggleButton.vue";
import Notification from "../components/UI/Notification.vue";
import { updateProduct } from "../utils/productUtils";

const products = ref([]);
const notificationMessage = ref("");
const notificationType = ref("success");

const fetchProducts = async () => {
  try {
    const response = await fetch("/api/products");
    const data = await response.json();
    products.value = data;
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};

const filteredProducts = computed(() => {
  return products.value.filter((product) => product.category === "fibers");
});

const updateProductField = ({ field, value, id }) => {
  const product = products.value.find((p) => p._id === id);
  if (product) {
    product[field] = value;
  }
};

const handleToggle = async (newValue, productId) => {
  try {
    const product = products.value.find((p) => p._id === productId);
    if (product) {
      product.flags.is_enabled = newValue;

      const result = await updateProduct(product);

      if (result.success) {
        notificationMessage.value = "Продукт обновлен!";
        notificationType.value = "success";
      } else {
        throw new Error(result.error);
      }
    }
  } catch (error) {
    console.error("Error updating product:", error);
    notificationMessage.value = "Ошибка обновления продукта!";
    notificationType.value = "error";
  }
};

// Сбрасываем сообщение после исчезновения уведомления
watch(notificationMessage, (newMessage) => {
  if (newMessage) {
    setTimeout(() => {
      notificationMessage.value = "";
    }, 3000);
  }
});

onMounted(() => {
  fetchProducts();
});
</script>

<style lang="scss">
.product-view {
  width: 100%;
  padding: 20px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;

  &__container {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 20px;
  }
}
</style>
