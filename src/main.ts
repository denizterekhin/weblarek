import './scss/styles.scss';


import { Api, ApiListResponse } from './components/base/Api';
import { IApi } from './types';
import { IProduct } from './types';
import { apiProducts } from './utils/data';
import { IBuyer } from './types';
import { TPayment } from './types';
import { API_URL } from './utils/constants';

//Классы с методами и их проверка работоспособности
class Buyer implements IBuyer {
    payment: TPayment;
    email: string;
    phone: string;
    address: string;

    constructor(payment: TPayment,
                email: string,
                phone: string,
                address: string)
    {
        this.payment = payment;
        this.email = email;
        this.phone = phone;
        this.address = address;     
    }
    // Метод для сохранения данных
    saveData(payment: TPayment, email: string, phone: string, address: string): void {
        this.payment = payment;
        this.email = email;
        this.phone = phone;
        this.address = address;
    }
    // Метод для получения всех данных покупателя
    getAllData(): { payment: TPayment; email: string; phone: string; address: string } {
        return {
            payment: this.payment,
            email: this.email,
            phone: this.phone,
            address: this.address
        };
    }
    // Метод для очистки данных покупателя
    clearData(): void {
        this.payment = undefined as unknown as TPayment; // Приводим к undefined, так как TPayment может быть конкретным типом
        this.email = '';
        this.phone = '';
        this.address = '';
    }
    // Метод для валидации данных
    validateData(): boolean {
        if (!this.payment || !this.email || !this.phone || !this.address) {
            return false;
        }

        // Проверка формата email
        const emailRegex = /^[\w]{1}[\w-\.]*@[\w-]+\.[a-z]{2,4}$/i;
        if (!emailRegex.test(this.email)) {
            return false;
        }

        // Проверка формата телефона
        const phoneRegex = /^[\d\+][\d\(\)\ -]{4,14}\d$/;
        if (!phoneRegex.test(this.phone)) {
            return false;
        }

        return true;
    }


}

//Проверка работоспособности класса Buyer
const buyerModel = new Buyer('card', 'dubrovskybobr@yandex.ru', '7-999-123-4567', 'г. Бобровск, ул. Боброва, д. 1, кв. 2');
buyerModel.saveData('cash', 'dubrovskybobr@yandex.ru', '7-999-123-4567', 'г. Бобровск, ул. Боброва, д. 1, кв. 2'); 
console.log('Получение всех данных покупателя: ', buyerModel.getAllData());

console.log('Валидация данных покупателя после введения данных: ', buyerModel.validateData());

buyerModel.clearData();
console.log('Получение всех данных покупателя после очистки: ', buyerModel.getAllData());

console.log('Валидация данных покупателя после очистки данных: ', buyerModel.validateData());






//////////////////////////////////////////////
class Products {
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



//////////////////////////////////////////////////////////////////////////
//Проверка работоспособности класса Products с использованием в качестве источника не сервер а константу 
// с данными apiProducts, имитирующие получени данных с сервера.

//const productsModel = new Products(apiProducts.items);

//productsModel.setItems(apiProducts.items); 
//console.log('Массив товаров из каталога: ', productsModel.getItems());
//console.log('Получения одного товара по его id: ', productsModel.getItemById('b06cde61-912f-4663-9751-09956c0eed67'));

//productsModel.setSelectedItem(apiProducts.items[0]);
//console.log('Получения товара для подробного отображения: ', productsModel.getSelectedItem());
/////////////////////////////////////////////////////////////////////////




/////////////////////////////////////////
class ShoppingCart {
    products: IProduct[];
    
    constructor(products: IProduct[] = [])
    {
        this.products = products;
    }
    // Метод для получения массива товаров в корзине
    getProducts(): IProduct[] {
        return this.products;
    }

    // Метод для добавления товара в корзину
    addProduct(product: IProduct): void {
        this.products.push(product);
    }

    // Метод для удаления товара из корзины
    removeProduct(product: IProduct): void {
        const index = this.products.indexOf(product);
        if (index !== -1) {
            this.products.splice(index, 1);
        }
    }

    // Метод для очистки корзины
    clearCart(): void {
        this.products = [];
    }

    // Метод для получения стоимости всех товаров в корзине
    getTotalCost(): number {
        let totalCost = 0;
        for (const product of this.products) {
            if (product.price !== null) {
                totalCost += product.price;
            }
        }
        return totalCost;
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

//Проверка работоспособности класса ShoppingCart
const shoppingCartModel = new ShoppingCart();

console.log('Массив товаров из корзины до добавления товаров: ', shoppingCartModel.getProducts());

shoppingCartModel.addProduct(apiProducts.items[2]);
shoppingCartModel.addProduct(apiProducts.items[1]);
shoppingCartModel.addProduct(apiProducts.items[3]);

console.log('Массив товаров из корзины после добавления товара: ', shoppingCartModel.getProducts());

let totalCost = shoppingCartModel.getTotalCost();
console.log('Получение стоимости всех товаров в корзине: ', totalCost);


let hasProductInCart = shoppingCartModel.hasProduct('b06cde61-912f-4663-9751-09956c0eed67');
console.log('Проверка наличия товара в корзине по его id: ', hasProductInCart);

shoppingCartModel.removeProduct(shoppingCartModel.products[1]);
console.log('Массив товаров из корзины после удаления одного товара: ', shoppingCartModel.getProducts());

totalCost = shoppingCartModel.getTotalCost();
console.log('Получение стоимости всех товаров в корзине: ', totalCost);


console.log('Получения количества товаров в корзине: ', shoppingCartModel.getItemCount());

shoppingCartModel.clearCart();
console.log('Массив товаров из корзины после очистки корзины: ', shoppingCartModel.getProducts());

totalCost = shoppingCartModel.getTotalCost();
console.log('Получение стоимости всех товаров в корзине после очистки корзины: ', totalCost);

console.log('Получения количества товаров в корзине: ', shoppingCartModel.getItemCount());

hasProductInCart = shoppingCartModel.hasProduct('b06cde61-912f-4663-9751-09956c0eed67');
console.log('Проверка наличия товара в корзине по его id: ', hasProductInCart);

interface IApiListOrder {
    customerDataOrder: IBuyer,
    productsOrder: IProduct[]
}

class productsAPI {
    private api: IApi;

    constructor(api: IApi) {
        this.api = api;
    }
    getProducts(): Promise<ApiListResponse<IProduct>> {
        return this.api.get('/product/').then((response: object) => {

      
        const typedResponse = response as ApiListResponse<IProduct>;
        return typedResponse;
        });
    }
    placeOrder(buyer: IBuyer, products: IProduct[]): Promise<IApiListOrder> { 
        const orderData = { buyer, products }; 
        return this.api.post('/order/', orderData);} 

}

///////////////////////////////////////////////////
//Запрос на сервер списка товаров, сохранение даных в классе Products и вывод сохраненных данных данных//
const yourApiInstance = new Api(API_URL); 

const apiInstance = new productsAPI(yourApiInstance);

apiInstance.getProducts()
  .then((response: ApiListResponse<IProduct>) => {
    // Сохраняем массив товаров в классе Products
    const productsModel = new Products(response.items);
    productsModel.setItems(response.items);

    console.log('Массив товаров из каталога: ', productsModel.getItems());
    console.log('Получение одного товара по его id: ', productsModel.getItemById('b06cde61-912f-4663-9751-09956c0eed67'));

    productsModel.setSelectedItem(response.items[0]);
    console.log('Получения товара для подробного отображения: ', productsModel.getSelectedItem());
  })
  .catch((error) => {
    console.error('Ошибка при получении списка товаров:', error);
  });