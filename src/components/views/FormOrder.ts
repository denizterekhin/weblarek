import { ensureElement, ensureAllElements } from "../../utils/utils";
import { Form } from "./Form";
import { IEvents } from "../base/Events";

interface IFormOrderUI {
  payment: 'cash' | 'card';
  address: string;
}

export class FormOrder extends Form<IFormOrderUI> {
  protected paymentButtons: HTMLElement[];
  protected addressElement: HTMLInputElement;
  protected paymentElement: 'cash' | 'card' | null;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.paymentButtons = Array.from(ensureAllElements('.order__buttons .button_alt', this.container));
    this.addressElement = ensureElement<HTMLInputElement>('.form__input', this.container);
    this.paymentElement = null;

    this.paymentButtons.forEach((button) => {
      button.addEventListener('click', (event: MouseEvent) => {
        const target = event.currentTarget as HTMLButtonElement;
        const value = target.name as 'cash' | 'card';
        //this.payment = value;
        this.events.emit('order:payment', { payment: value });
      });
    });

    this.addressElement.addEventListener('input', () => {
      this.events.emit('order:address', { address: this.addressElement.value });
    });

    this.button.addEventListener('click', () => {
      this.events.emit('order:next');
    });
  }

  set payment(value: 'cash' | 'card') {
    this.paymentElement = value;

    this.paymentButtons.forEach((button) => {
      const buttonElement = button as HTMLButtonElement;
      if (buttonElement.name === value) {
        buttonElement.classList.add('button_alt-active');
      } else {
        buttonElement.classList.remove('button_alt-active');
      }
    });
  }

  set address(value: string) {
    this.addressElement.value = value;
  }
  updatePaymentDisplay(payment: 'cash' | 'card'): void {
    this.paymentButtons.forEach((button) => {
      const buttonElement = button as HTMLButtonElement;
      if (buttonElement.name === payment) {
       buttonElement.classList.add('button_alt-active');
      } else {
        buttonElement.classList.remove('button_alt-active');
      }
    });
  }
  clearForm() {
    this.addressElement.value = '';
    this.paymentElement = null;
    this.paymentButtons.forEach((button) => {
      const buttonElement = button as HTMLButtonElement;
        buttonElement.classList.remove('button_alt-active');
    });
  }
}