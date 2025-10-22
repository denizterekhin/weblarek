import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class Products {
  protected items: IProduct[]; // Массив всех товаров
  protected selectedItem: IProduct | null; // Товар, выбранный для подробного отображения
  protected events: IEvents;

  constructor(events: IEvents) {
    this.items = [];
    this.selectedItem = null; // Инициализируем selectedItem как null
    this.events = events;
  }

  // Метод для сохранения массива товаров
  setItems(items: IProduct[]): void {
    this.items = items;
    this.events.emit('catalog:changed', this.items);
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
    this.events.emit('card:select', this.selectedItem);
    
  }

  // Метод для получения товара для подробного отображения
  getSelectedItem(): IProduct | null {
    return this.selectedItem;
  }
} 