import { IBuyer, IProduct, IApi } from "../../types";
import { ApiListResponse } from "../base/Api";

interface IApiListOrder {
    id?: string;
    total?: number;
    error?: string;
    code?: number;
}

export class ProductsAPI {
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
    placeOrder(order: IBuyer, items: IProduct[], cost: number): Promise<IApiListOrder> { 
        	const payload = {
    		...order,
			total: cost,
			items: items.map(item => item.id),
            };
        return this.api.post('/order', payload);} 

}