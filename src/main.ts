import './scss/styles.scss';

import { Api, ApiListResponse } from './components/base/Api';
import { IApi } from './types';
import { IProduct } from './types';
import { apiProducts } from './utils/data';
import { IBuyer } from './types';
import { API_URL } from './utils/constants';
import { Buyer } from './components/models/Buyer';
import { Products } from './components/models/Products';
import { ShoppingCart } from './components/models/ShoppingCart';

//Проверка работоспособности классов

//Проверка работоспособности класса Buyer
const buyerModel = new Buyer('card', 'dubrovskybobr@yandex.ru', '7-999-123-4567', 'г. Бобровск, ул. Боброва, д. 1, кв. 2');
buyerModel.saveData('cash', 'dubrovskybobr@yandex.ru', '7-999-123-4567', 'г. Бобровск, ул. Боброва, д. 1, кв. 2'); 

console.log('Получение всех данных покупателя: ', buyerModel.getAllData());

console.log('Валидация данных покупателя после введения данных: ', buyerModel.validateData());

buyerModel.clearData();
console.log('Получение всех данных покупателя после очистки: ', buyerModel.getAllData());

console.log('Валидация данных покупателя после очистки данных: ', buyerModel.validateData());

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

/////////////////////////////////////////////////////////////////////////
// Интерфейс и класс для запроса с сервера данных
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