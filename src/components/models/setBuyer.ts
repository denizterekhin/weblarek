import { TPayment } from "../../types";
import { IBuyer } from "../../types";

export class setBuyer implements IBuyer {
  constructor(
    public payment: TPayment,
    public email: string,
    public phone: string,
    public address: string
  ) {}
}
