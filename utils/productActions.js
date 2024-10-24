export const saveProduct = async (product) => {
    try {
        const response = await fetch("/api/products/update-product", {
            method: "POST",
            body: product // Отправка FormData напрямую
        });

        const data = await response.json();
        console.log("Response from server:", data); // Логируем ответ сервера

        if (!response.ok) {
            throw new Error("Error saving product");
        }

        return { success: true, data };
    } catch (error) {
        console.error("Error saving product:", error);
        return { success: false, error: error.message };
    }
};

export const updateProduct = saveProduct;

export const deleteProduct = async (productId) => {
    try {
        const response = await fetch(
            `/api/products/delete-product?id=${productId}`,
            {
                method: "DELETE"
            }
        );

        if (!response.ok) {
            throw new Error("Error deleting product");
        }

        const data = await response.json();
        return { success: true, data };
    } catch (err) {
        console.error("Error deleting product:", err);
        return { success: false, error: err.message };
    }
};

export const deleteProductImage = async (productId, imageUrl, imageType) => {
    try {
        const response = await fetch("/api/products/delete-image", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ productId, imageUrl, imageType })
        });

        if (!response.ok) {
            throw new Error("Error deleting image");
        }

        return await response.json();
    } catch (error) {
        console.error("Error deleting image:", error);
        return { success: false, error: error.message };
    }
};

export const fetchProductById = async (productId) => {
    try {
        const response = await fetch(
            `/api/products/get-product?id=${productId}`,
            {
                method: "GET"
            }
        );

        if (!response.ok) {
            throw new Error("Error fetching product");
        }

        const data = await response.json();
        return data; // Возвращаем данные продукта
    } catch (error) {
        console.error("Error fetching product:", error);
        return null; // В случае ошибки возвращаем null
    }
};
