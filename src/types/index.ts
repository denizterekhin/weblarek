type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';
type TItemPrice = number | null;

interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

type TPayment = "card" | "cash";

interface IProduct {
  category: string;
  description: string;
  id: string;
  image: string;
  price: TItemPrice;
  title: string;
} 

interface IBuyer {
  payment: TPayment | null;
  email: string;
  phone: string;
  address: string;
} 

interface ICardActions {
    onClick?: (event: Event) => void;
}

interface ICardPreview extends IProduct {
  inBasket: boolean;
  canAddToBasket: boolean;
}




export {IProduct, IBuyer, TPayment, ApiPostMethods, IApi, TItemPrice, ICardActions, ICardPreview};