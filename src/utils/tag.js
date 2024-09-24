import transactionEnum from "./enums/transactionEnum";
import { getUUID } from "./uuidUtil";

export default class Tag {
	constructor(amount, type = transactionEnum.DEBIT, name = "") {
		this.id = getUUID();
		this.name = name;
		this.amount = amount;
		this.type = type;
	}
}
