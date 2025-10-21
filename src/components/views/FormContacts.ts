import { ensureElement } from "../../utils/utils";
import { Form } from "./Form";
import { IEvents } from "../base/Events";

interface IFormContacts {
  email: string;
  phone: string;
}

export class FormContacts extends Form<IFormContacts> {
  protected emailElement: HTMLInputElement;
  protected phoneElement: HTMLInputElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.emailElement = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
    this.phoneElement = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);

    this.emailElement.addEventListener('input', () => {
      this.events.emit('contacts:email', { email: this.emailElement.value });
    });

    this.phoneElement.addEventListener('input', () => {
      const formattedPhone = this.formatPhoneNumber(this.phoneElement.value);
      this.phoneElement.value = formattedPhone;
      this.events.emit('contacts:phone', { phone: formattedPhone });
    });

    this.button.addEventListener('click', (event) => {
      event.preventDefault();
      this.events.emit('order:submit');
    });
  }

  set email(value: string) {
    this.emailElement.value = value;
  }

  set phone(value: string) {
    this.phoneElement.value = value;
  }

  //Функция для задания маски телефона
  private formatPhoneNumber(value: string): string {
    const numbers = value.replace(/\D/g, '');
    
    const cleanNumber = numbers.startsWith('8') ? '7' + numbers.slice(1) : numbers;
    
    const limitedNumber = cleanNumber.slice(0, 11);
    
    // +7 (XXX) XXX-XX-XX
    if (limitedNumber.length === 0) return '';
    if (limitedNumber.length <= 1) return '+7';
    if (limitedNumber.length <= 4) return `+7 (${limitedNumber.slice(1)}`;
    if (limitedNumber.length <= 7) return `+7 (${limitedNumber.slice(1, 4)}) ${limitedNumber.slice(4)}`;
    if (limitedNumber.length <= 9) return `+7 (${limitedNumber.slice(1, 4)}) ${limitedNumber.slice(4, 7)}-${limitedNumber.slice(7)}`;
    return `+7 (${limitedNumber.slice(1, 4)}) ${limitedNumber.slice(4, 7)}-${limitedNumber.slice(7, 9)}-${limitedNumber.slice(9)}`;
  }
}