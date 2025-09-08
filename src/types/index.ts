type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

type TPayment = "card" | "cash";


interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
} 

interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
} 

export {IProduct, IBuyer, TPayment, ApiPostMethods, IApi};