import { IProduct } from "../../types";
import { Card } from "./Card";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";

export interface IProductWithIndex extends IProduct {
  index: number;
}

export interface ICardBasketActions {
    onRemove?: () => void;
}

export class CardBasket extends Card<IProductWithIndex> {
    protected indexElement: HTMLElement;   
    protected buttonRemoveItem: HTMLButtonElement; 
    constructor(protected container: HTMLElement, protected events: IEvents , protected actions?: ICardBasketActions) {
        super(container);
        this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
        this.buttonRemoveItem = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);
        this.buttonRemoveItem.addEventListener('click', () => {
            if (this.actions?.onRemove) {
        this.actions.onRemove();} 
            });
    }

    set index( value: number) {
        this.indexElement.textContent = String(value);
    }
}