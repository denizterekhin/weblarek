import { TPayment } from "../../types";

export class Buyer {
    payment: TPayment;
    email: string;
    phone: string;
    address: string;

    constructor(payment: TPayment,
                email: string,
                phone: string,
                address: string)
    {
        this.payment = payment;
        this.email = email;
        this.phone = phone;
        this.address = address;     
    }
    // Метод для сохранения данных
    saveData(payment: TPayment, email: string, phone: string, address: string): void {
        if (!payment || !email || !phone || !address) {
            throw new Error('При сохранении данных получены не все данные покупателя!');
        }
        this.payment = payment;
        this.email = email;
        this.phone = phone;
        this.address = address;
    }
    // Метод для получения всех данных покупателя
    getAllData(): { payment: TPayment; email: string; phone: string; address: string } {
        return {
            payment: this.payment,
            email: this.email,
            phone: this.phone,
            address: this.address
        };
    }
    // Метод для очистки данных покупателя
    clearData(): void {
        this.payment = undefined as unknown as TPayment; // Приводим к undefined, так как TPayment может быть конкретным типом
        this.email = '';
        this.phone = '';
        this.address = '';
    }
    // Метод для валидации данных
    validateData(): boolean {
        if (!this.payment || !this.email || !this.phone || !this.address) {
            return false;
        }
        return true;
    }


}