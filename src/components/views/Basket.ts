import { IProduct } from "../../types";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

export interface IBasketContent {
    items: IProduct[];
	total: number;
}

export class Basket <IBasketContent> extends Component<IBasketContent> {
    protected listContainer: HTMLUListElement;
	protected priceContainer: HTMLElement;
	protected orderButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.listContainer = ensureElement<HTMLUListElement>('.basket__list', this.container);
	    this.priceContainer = ensureElement<HTMLElement>('.basket__price', this.container);
	    this.orderButton =  ensureElement<HTMLButtonElement>('.basket__button', this.container);

        this.orderButton.addEventListener('click', () => {
			this.events.emit('order');
		});
    }
   
    set items(items: HTMLElement[]) {
		this.listContainer.replaceChildren(...items);
	}

	set total(price: number) {
		this.priceContainer.textContent = `${price} синапсов`;
        this.changeDisabledState(this.orderButton, price == 0);
	}
	set message(value: string) {
		this.listContainer.textContent = value;
	}
	
}