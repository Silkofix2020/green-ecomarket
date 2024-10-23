export async function fetchMainProductsCount() {
  const response = await fetch("/api/main-products/count");
  const data = await response.json();
  return data.count;
}

export async function addProductToMainCollection(productId) {
  await fetch(`/api/main-products/add`, {
    method: "POST",
    body: JSON.stringify({ productId }),
    headers: { "Content-Type": "application/json" },
  });
}

export async function removeProductFromMainCollection(productId) {
  await fetch(`/api/main-products/remove`, {
    method: "POST",
    body: JSON.stringify({ productId }),
    headers: { "Content-Type": "application/json" },
  });
}
