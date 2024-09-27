import transactionEnum from "./enums/transactionEnum";
import Tag from "./tag";
import Transaction from "./transaction";
import { getUUID } from "./uuidUtil";

export default class wallet {
	/**
	 * @param {string} [name=""] - name of wallet
	 *
	 * Creates a new wallet
	 */
	constructor(name = "") {
		this.id = getUUID();
		this.name = name;
		this.transactions = [];
		this.tags = [];
		this.defaultIncomeTag = new Tag(Infinity, transactionEnum.CREDIT, "income");
		this.tags.push(this.defaultIncomeTag);
	}

	getTransactions(month = new Date().getMonth(), year = new Date().getFullYear()) {
		return this.transactions.filter((transaction) => {
			const transactionDate = new Date(transaction.date);

			return transactionDate.getMonth() == month && transactionDate.getFullYear() == year;
		});
	}

	verifyTransaction(tag, transaction) {
		if (!(transaction instanceof Transaction)) {
			throw new Error("Transaction must be instance of Transaction");
		}

		if (tag.id !== transaction.tag.id) {
			throw new Error("Tag does not match transaction");
		}

		if (tag.type !== transaction.type) {
			throw new Error("Type does not match transaction");
		}

		const currentTagAmount = this.getTagAmount(tag);
		if (currentTagAmount + transaction.amount > tag.amount) {
			throw new Error("Tag does not have enough amount");
		}
	}

	addTransaction(transaction, tag) {
		if (transaction.type === transactionEnum.DEBIT) {
			this.addExpense(transaction, tag);
		}
		if (transaction.type === transactionEnum.CREDIT) {
			this.addIncome(transaction, this.defaultIncomeTag);
		}
	}

	addExpense(transaction, tag) {
		if (typeof tag === "string") {
			tag = this.tags.find((t) => t.id === tag);
		}
		console.log(tag);

		if (!(transaction instanceof Transaction)) {
			throw new Error("Transaction must be instance of Transaction");
		}

		transaction.addTag(tag);
		this.verifyTransaction(tag, transaction);
		this.transactions.push(transaction);
	}

	addIncome(transaction, tag) {
		transaction.addTag(tag);
		this.transactions.push(transaction);
	}

	addTag(tag) {
		const totalIncome = this.getTotalIncome();
		const totalTagExpense = this.getTagTotalExpense();
		if (totalIncome - totalTagExpense < tag.amount) {
			throw new Error("Tag expense cannot be greater than tag amount");
		}

		this.tags.push(tag);
	}

	getTags() {
		return this.tags;
	}

	getTotalIncome() {
		let amount = 0;
		for (const ele of this.getTransactions()) {
			if (ele.type === transactionEnum.DEBIT) continue;
			amount += ele.amount;
		}
		return amount;
	}

	getTotalExpense() {
		let amount = 0;
		for (const ele of this.getTransactions()) {
			if (ele.type === transactionEnum.CREDIT) continue;
			amount += ele.amount;
		}
		return amount;
	}

	getTagTotalExpense() {
		let amount = 0;
		for (const ele of this.tags) {
			if (ele.type === transactionEnum.CREDIT) continue;
			amount += ele.amount;
		}
		return amount;
	}

	getTagAmount(tag) {
		let amount = 0;
		for (const ele of this.getTransactions()) {
			if (ele.tag.id !== tag.id) continue;
			amount += ele.amount;
		}
		return amount;
	}

	updateTagValue(tag, amount) {
		if (typeof tag === "string") {
			tag = this.tags.find((t) => t.id === tag);
		}

		const tagExpense = this.getTagAmount(tag);
		if (amount < tagExpense) {
			throw new Error("Tag expense cannot be greater than tag amount");
		}

		for (const ele of this.tags) {
			if (ele.id !== tag.id) continue;
			ele.amount = amount;
		}
	}

	static saveWalletToLocalStorage(wallet) {
		localStorage.setItem("wallet", JSON.stringify(wallet));
	}

	static getWalletFromLocalStorage() {
		try {
			// throw new Error("Not Implemented");
			const walletdata = JSON.parse(localStorage.getItem("wallet"));
			return Object.assign(new wallet("helix"), walletdata);
		} catch (error) {
			console.error(error);

			return new wallet("helix");
		}
	}
}
