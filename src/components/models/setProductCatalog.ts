import { IProduct } from "../../types";

export class setProductCatalog{

    items: IProduct[]; // Массив всех товаров, соответствующий интерфейсу IProduct
    selectedItem: IProduct | null; // Товар, выбранный для подробного отображения

    constructor(items: IProduct[])
    {
        this.items = items;
        this.selectedItem = null; // Инициализируем selectedItem как null
    }
}