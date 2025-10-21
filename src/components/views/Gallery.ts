import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

interface GallereyData {
  catalog: HTMLElement[];
}

//Класс для отображения галереи карточек
export class Gallery extends Component<GallereyData> {
    protected catalogElement: HTMLElement;

    constructor(protected container: HTMLElement) {
        super(container);
        
        this.catalogElement = ensureElement<HTMLElement>('.gallery', this.container);
    }

    set catalog(items:HTMLElement[]) {
      this.catalogElement.replaceChildren(...items);
    }
}