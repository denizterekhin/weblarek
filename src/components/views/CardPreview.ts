import { Card } from "./Card";
import { IProduct } from "../../types";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { CategoryKey, categoryMap, CDN_URL } from "../../utils/constants";

export type TCardPreview = Pick<IProduct, 'image' | 'category' | 'description'>;

export class CardPreview extends Card<TCardPreview> {
     protected descriptionElement: HTMLElement; 
     protected toBasketButton: HTMLButtonElement; 
     protected imageElement: HTMLImageElement;
     protected categoryElement: HTMLElement;
     
    constructor(container: HTMLElement, protected events: IEvents ) {
        super(container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.descriptionElement = ensureElement<HTMLElement>('.card__text', this.container);
        this.toBasketButton = ensureElement<HTMLButtonElement>('.card__button', this.container);
        this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
        this.toBasketButton.addEventListener('click', () => {
            const currentState = this.toBasketButton.textContent;
            if (currentState === 'Купить') {
                this.events.emit('item:to_basked');
                this.buttonState = 'remove';
            } else if (currentState === 'Удалить из корзины') {
            this.events.emit('delet: item_inBasket_windowPreviewCard');
            this.buttonState = 'add';
            this.events.emit('modal:close');
            }
        });

    }
    set category(value: string) {
        this.categoryElement.textContent = value;

        for (const key in categoryMap) {
            this.categoryElement.classList.toggle(
                categoryMap[key as CategoryKey],
                key === value
            );
        }
    }

     set image(value: string) {
        this.setImage(this.imageElement,CDN_URL + value, this.title);
    }

    set description(value: string) {
        this.descriptionElement.textContent = value;
    }
    
    set buttonState(state: 'add' | 'remove' | 'disabled') {
        this.toBasketButton.textContent = state === 'add' ? 
        'Купить' 
        : state === 'remove' 
        ? 'Удалить из корзины' 
        : 'Недоступно';
        this.toBasketButton.disabled = state === 'disabled';
    }
}
