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
		this.dateFilter = { month: new Date().getMonth(), year: new Date().getFullYear() };
	}
	WALLET_LC_ID = "wallet";

	getTransactions() {
		return this.transactions.filter((transaction) => {
			const transactionDate = new Date(transaction.date);

			return transactionDate.getMonth() == this.dateFilter.month && transactionDate.getFullYear() == this.dateFilter.year;
		});
	}

	getTags() {
		return this.tags.filter((tag) => {
			if (tag.type == transactionEnum.CREDIT) return true;

			// this is done to save guard this
			// months tags
			const tagDate = new Date(tag.date ?? "2024-10-02T05:50:41.487Z");
			return tagDate.getMonth() == this.dateFilter.month && tagDate.getFullYear() == this.dateFilter.year;
		});
	}

	tagHasTransactions(tagId) {
		for (const transaction of this.transactions) {
			if (transaction.tag.id != tagId) continue;
			console.log("TAG ID :: ", tagId);
			console.log(transaction);

			return true;
		}
		return false;
	}

	deleteTransaction(id) {
		this.transactions = this.transactions.filter((transaction) => {
			console.log(transaction);

			return transaction.id != id;
		});
		this.saveWalletToLocalStorage();
	}

	deleteTag(id) {
		if (this.tagHasTransactions(id)) throw new Error("Cannot Delete tag as it has transactions");
		this.tags = this.tags.filter((tag) => {
			return tag.id != id;
		});
		this.saveWalletToLocalStorage();
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
		this.saveWalletToLocalStorage();
	}

	addExpense(transaction, tag) {
		if (typeof tag === "string") {
			tag = this.getTags().find((t) => t.id === tag);
		}

		if (!(transaction instanceof Transaction)) {
			throw new Error("Transaction must be instance of Transaction");
		}

		transaction.addTag(tag);
		this.verifyTransaction(tag, transaction);
		this.transactions.push(transaction);
		this.saveWalletToLocalStorage();
	}

	addIncome(transaction, tag) {
		transaction.addTag(tag);
		this.transactions.push(transaction);
		this.saveWalletToLocalStorage();
	}

	addTag(tag) {
		const totalIncome = this.getTotalIncome();
		const totalTagExpense = this.getTagTotalExpense();
		if (totalIncome - totalTagExpense < tag.amount) {
			throw new Error("Tag expense cannot be greater than tag amount");
		}

		this.tags.push(tag);
		this.saveWalletToLocalStorage();
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
		for (const ele of this.getTags()) {
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
			tag = this.getTags().find((t) => t.id === tag);
		}

		const tagExpense = this.getTagAmount(tag);
		if (amount < tagExpense) {
			throw new Error("Tag expense cannot be greater than tag amount");
		}

		for (const ele of this.getTags()) {
			if (ele.id !== tag.id) continue;
			ele.amount = amount;
		}
		this.saveWalletToLocalStorage();
	}

	saveWalletToLocalStorage() {
		wallet.saveWalletToLocalStorage(this);
	}

	static saveWalletToLocalStorage(wallet) {
		localStorage.setItem(wallet.WALLET_LC_ID, JSON.stringify(wallet));
	}

	static getWalletFromLocalStorage() {
		try {
			// throw new Error("Not Implemented");
			const walletData = JSON.parse(localStorage.getItem(wallet.WALLET_LC_ID));
			return Object.assign(new wallet("helix"), walletData);
		} catch (error) {
			console.error(error);

			return new wallet("helix");
		}
	}
}
