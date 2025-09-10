import { IProduct } from "../../types";

export class Products {
  items: IProduct[]; // Массив всех товаров
  selectedItem: IProduct | null; // Товар, выбранный для подробного отображения

  constructor(items: IProduct[]) {
    this.items = items;
    this.selectedItem = null; // Инициализируем selectedItem как null
  }

  // Метод для сохранения массива товаров
  setItems(items: IProduct[]): void {
    this.items = items;
  }

  // Метод для получения массива товаров
  getItems(): IProduct[] {
    return this.items;
  }

  // Метод для получения одного товара по его id
  getItemById(id: string): IProduct | undefined {
    return this.items.find(item => item.id === id);
  }

  // Метод для сохранения товара для подробного отображения
  setSelectedItem(item: IProduct): void {
    this.selectedItem = item;
  }

  // Метод для получения товара для подробного отображения
  getSelectedItem(): IProduct | null {
    return this.selectedItem;
  }
} 