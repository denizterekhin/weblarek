import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IProduct } from "../../types";

export type TCard = Pick<IProduct, 'title' | 'price'>;

export class Card<T> extends Component<T & TCard> {
    
    protected priceElement: HTMLElement;
    protected titleElement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        
        this.titleElement = ensureElement<HTMLElement>('.card__title', this.container);
        this.priceElement = ensureElement<HTMLElement>('.card__price', this.container);
    }

    set price(value:number | null) {
        this.priceElement.textContent = (value? `${value} синапсов` : 'Бесценно')
    }

    set title(value:string) {
        this.titleElement.textContent = value;
    }
}