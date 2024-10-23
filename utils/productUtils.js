export const saveProduct = async (product) => {
  try {
    const response = await fetch("/api/products/update-product", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });

    if (!response.ok) {
      throw new Error("Error saving product");
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error saving product:", error);
    return { success: false, error: error.message };
  }
};

export const updateProduct = saveProduct;
