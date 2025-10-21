import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class ShoppingCart {
    protected products: IProduct[];
    protected events: IEvents;
    constructor(events: IEvents)
    {
        this.products = [];
        this.events = events;
    }

    // Метод для получения массива товаров в корзине
    getProducts(): IProduct[] {
        return this.products;
    }

    // Метод для добавления товара в корзину
    addProduct(product: IProduct): void {
        if (product.price !== null) {
            this.products.push(product);
        } 
        else {
            console.log('Товар с нулевой ценой не может быть добавлен в корзину, так как нельзя совершить покупку товара с нулевой ценой.');
        }
        this.events.emit('basket: changed');
    }

    // Метод для удаления товара из корзины
    removeProduct(product: IProduct): void {
        const index = this.products.indexOf(product);
        if (index !== -1) {
            this.products.splice(index, 1);
        }
        this.events.emit('basket: changed');
    }

    // Метод для очистки корзины
    clearCart(): void {
        this.products = [];
        this.events.emit('basket: changed');
    }

    // Метод для получения стоимости всех товаров в корзине
    getTotalCost(): number {
        return this.products.reduce((totalCost, product) => {
            totalCost += product.price!; // Использование оператора ! для утверждения, что price не null
        return totalCost;
    }, 0);
    }
    
    // Метод для получения количества товаров в корзине
    getItemCount(): number {
        return this.products.length;
    }

    // Метод для проверки наличия товара в корзине по его id
    hasProduct(id: string): boolean {
        return this.products.some(product => product.id === id);
    }
}