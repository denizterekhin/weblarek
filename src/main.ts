import './scss/styles.scss';

import { Api } from './components/base/Api';
import { IProduct } from './types';
import { API_URL, settings } from './utils/constants';
import { Buyer } from './components/models/Buyer';
import { Products } from './components/models/Products';
import { ShoppingCart } from './components/models/ShoppingCart';
import { EventEmitter } from './components/base/Events';
import { ensureElement, cloneTemplate } from './utils/utils';
import { CardCatalog } from './components/views/CardCatalog';
import { Gallery } from './components/views/Gallery';
import { ModalWindow } from './components/views/ModalWindow';
import { Header } from './components/views/Header';
import { Basket } from './components/views/Basket';
import { CardPreview } from './components/views/CardPreview';
import { CardBasket } from './components/views/CardBasket';
import { ProductsAPI } from './components/api/ProductsAPI';
import { Success } from './components/views/Success';
import { FormContacts } from './components/views/FormContacts';
import { FormOrder } from './components/views/FormOrder';


const events = new EventEmitter();
const shoppingCartModel = new ShoppingCart(events);
const cardBasketCardTemplate : HTMLTemplateElement = ensureElement<HTMLTemplateElement>('#card-basket');
const yourApiInstance = new Api(API_URL, settings); 
const gallerey = new Gallery(document.body);
const apiInstance = new ProductsAPI(yourApiInstance);
const productsModel = new Products(events);
const cardCatalogTemplate: HTMLTemplateElement = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate : HTMLTemplateElement = ensureElement<HTMLTemplateElement>('#card-preview');
const basketContainerTemplate : HTMLTemplateElement = ensureElement<HTMLTemplateElement>('#basket');
const basket = new Basket(cloneTemplate(basketContainerTemplate), events);
const headerContainer : HTMLElement = ensureElement<HTMLElement>('.header');
const header = new Header( events, headerContainer);
const modal = new ModalWindow(ensureElement('#modal-container'), events);
const buyer = new Buyer(events);


const orderTemplate: HTMLTemplateElement = ensureElement<HTMLTemplateElement>('#order');
const order = new FormOrder(cloneTemplate(orderTemplate), events);

const contactsTemplate: HTMLTemplateElement = ensureElement<HTMLTemplateElement>('#contacts');
const contacts = new FormContacts(cloneTemplate(contactsTemplate), events);

const successTemplate: HTMLTemplateElement = ensureElement<HTMLTemplateElement>('#success');
const success = new Success(cloneTemplate(successTemplate), events);


///////////////////////////////////////////////////////////////////////////////////////////////
//Получение тоаров и рендер галереи карточек товаров
events.on('catalog:changed', () => {
  const itemCards = productsModel.getItems().map((item) =>{
    const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
      onClick: () => events.emit('card:select', item)
    });
    return card.render(item);
  });
  gallerey.render({catalog: itemCards});
});

// кликнули по карточке на витрине, вызвав окно предпросмотра карточки товара
events.on('card:select', (item: IProduct) => {
  productsModel.setSelectedItem(item);
  const newCardPreview = new CardPreview(
    cloneTemplate(cardPreviewTemplate), events);
  const selectedItem = productsModel.getSelectedItem();
  if (selectedItem?.price!=null) {
    const inBasket = shoppingCartModel.hasProduct(selectedItem.id);
    if (inBasket==true) {
      newCardPreview.buttonState = 'remove';
    }
    else {
      newCardPreview.buttonState = 'add';
    }
  }
  if (selectedItem?.price==null) {
    newCardPreview.buttonState = 'disabled';
  }
  modal.render({
    content: newCardPreview.render({ ...selectedItem })
  });
  modal.open();
});

// нажата кнопка В корзину в предпросмотре карточки
events.on('item:to_basked', () => {
  const selectedItem = productsModel.getSelectedItem();
  if (selectedItem) {
    shoppingCartModel.addProduct(selectedItem);
    modal.close();
  }
  else {
    console.warn('Товар не выбран');
  }
});

// нажали изображение корзины на главной странице
events.on('basket:open', () => {
  //if (shoppingCartModel.getItemCount() === 0) {
   // basket.message = 'Корзина пуста';
   // basket.render({total: shoppingCartModel.getTotalCost() });
  //};
	modal.render({content: basket.render()})
	modal.open();
});

// Корзина изменилась
events.on('basket: changed', () => {
  if (shoppingCartModel.getItemCount() === 0) {
    basket.message = 'Корзина пуста';
    header.render({ counter: shoppingCartModel.getItemCount() });
    basket.render({total: shoppingCartModel.getTotalCost() });
  }
  else {
    const items = shoppingCartModel.getProducts().map((item, index) => {
        const card = new CardBasket(cloneTemplate(cardBasketCardTemplate), events, {onRemove: () => {
        shoppingCartModel.removeProduct(item);}});
        return card.render({
            ...item,
            index: index + 1
        });
    });

    header.render({ counter: shoppingCartModel.getItemCount() });
    basket.render({ items: items, total: shoppingCartModel.getTotalCost() });
  }
});

//Удаление карточки товара
events.on('delet: item_inBasket', () => {
    shoppingCartModel.removeProduct(productsModel.getSelectedItem() as IProduct);
    modal.close();
});

apiInstance
  .getProducts()
  .then((data)=> {
    productsModel.setItems(data.items);
  })
  .catch((err) => console.error(err));
//////////////////////////////////////////////////////////////////////


events.on('order', () => {
  validateOrderForm();
  modal.render({content: order.render()})

});


// Функция для валидации формы заказа
function validateOrderForm() {
  const paymentValidation = buyer.validatePayment();
  const addressValidation = buyer.validateAddress();

  const isValid = paymentValidation.isValid && addressValidation.isValid;
  const error = !paymentValidation.isValid ? paymentValidation.error : addressValidation.error;
  
  order.buttonState = isValid;
  order.error = error ?? '';
}

// События формы заказа
events.on('order:payment', (data: { payment: 'cash' | 'card' }) => {
  buyer.setPayment(data.payment as 'cash' | 'card');
  validateOrderForm();
});

events.on('order:address', (data: { address: string }) => {
  buyer.setAddress(data.address);
  validateOrderForm();
});

events.on('order:next', () => {
  validateContactsForm();
  modal.render({content: contacts.render()});
});

// Функция для валидации формы контактов
function validateContactsForm() {
  const emailValidation = buyer.validateEmail();
  const phoneValidation = buyer.validatePhone();
  
  const isValid = emailValidation.isValid && phoneValidation.isValid;
  const error = !emailValidation.isValid ? emailValidation.error : phoneValidation.error;

  contacts.buttonState = isValid;
  contacts.error = error ?? '';
}

// События формы контактов
events.on('contacts:email', (data: { email: string }) => {
  buyer.setEmail(data.email);
  validateContactsForm();
});

events.on('contacts:phone', (data: { phone: string }) => {
  buyer.setPhone(data.phone);
  validateContactsForm();
});


//Нажата кнопка оплатить в FormContacts
events.on('order:submit', () => {
	success.total = 0;
	apiInstance.placeOrder(buyer.getAllData(), shoppingCartModel.getProducts(), shoppingCartModel.getTotalCost())
		.then((data) => {
			success.total = data.total as number;
			modal.render({content: success.render()});
			modal.open();
      shoppingCartModel.clearCart();
      buyer.clearData();
		})
		.catch((err) => {
			console.error('Ошибка при отправке заказа:', err);
			alert('Сервер всё еще не отвечает')
			success.total = shoppingCartModel.getTotalCost();
			modal.render({content: success.render()});
			modal.open();
		});	

});
/*
events.on('order:submit', async () => {
  const buyerData = buyer.getAllData();
  const cartItems = shoppingCartModel.getProducts();

  if (!buyerData.payment || !buyerData.address || !buyerData.email || !buyerData.phone || cartItems.length === 0) {
    return;
  }

  try {
    success.total =  shoppingCartModel.getTotalCost();
    modal.render({content: success.render()});
    modal.open();
    shoppingCartModel.clearCart();
    buyer.clearData();
  } catch (e) {
    order.error = 'Ошибка оплаты. Попробуйте ещё раз.';
  }
});
*/

//Событие модальных окон
events.on('modal:close', () => {
  modal.close();
});

