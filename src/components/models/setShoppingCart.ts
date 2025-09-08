import { IProduct } from "../../types";

export class setShoppingCart {
    products: IProduct[];
    
    constructor(products: IProduct[] = [])
    {
        this.products = products;
    }
}