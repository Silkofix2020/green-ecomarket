export function formattedStringToSlug(str) {
  return str
    .toLowerCase() // Преобразуем строку в нижний регистр
    .replace(/\s+/g, "-"); // Заменяем пробелы на дефисы
}
