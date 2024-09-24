import TransactionEnum from "../utils/enums/transactionEnum";
import { getUUID } from "./uuidUtil";
export default class Transaction {
	/**
	 * @param {number} amount - amount of transaction
	 * @param {TransactionEnum} [type=TransactionEnum.DEBIT] - category of transaction
	 * @param {string} [comment=""] - comment for transaction
	 *
	 * Creates a new Transaction instance
	 */
	constructor(amount, type = TransactionEnum.DEBIT, comment = "") {
		this.id = getUUID();
		this.date = new Date();
		this.tag;
		this.amount = amount;
		this.type = type;
		this.comment = comment;
	}

	addTag(tag) {
		this.tag = tag;
	}
}
