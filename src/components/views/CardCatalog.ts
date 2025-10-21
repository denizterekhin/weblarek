import { IProduct } from "../../types";
import { CDN_URL } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { ICardActions } from "../../types";
import { Card } from "./Card";
import { CategoryKey, categoryMap } from "../../utils/constants";

export type TCardCatalog = Pick<IProduct, 'image' | 'category'>;

export class CardCatalog extends Card<TCardCatalog> {
    protected imageElement: HTMLImageElement;
    protected categoryElement: HTMLElement;


    constructor(container: HTMLElement, actons?: ICardActions) {
        super(container);
        this.categoryElement = ensureElement<HTMLElement>(
            '.card__category', this.container);
        
        this.imageElement = ensureElement<HTMLImageElement>(
            '.card__image', this.container);
        if (actons?.onClick) {
            this.container.addEventListener('click', actons.onClick)
        }  
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
}