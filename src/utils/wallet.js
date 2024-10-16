import axios from "axios";
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
	static WALLET_LC_ID = "wallet";

	getTransactions() {
		return this.transactions
			.sort((a, b) => new Date(b.date) - new Date(a.date))
			.filter((transaction) => {
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

			return true;
		}
		return false;
	}

	deleteTransaction(id) {
		this.transactions = this.transactions.filter((transaction) => {
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

	getDebitAmount(tagId) {
		let amount = 0;
		for (const ele of this.getTransactions()) {
			if (ele.tag.id !== tagId) continue;
			if (ele.type === transactionEnum.CREDIT) continue;
			amount += ele.amount;
		}
		return amount;
	}

	saveWalletToLocalStorage() {
		wallet.saveWalletToLocalStorage(this);
	}

	getTotalSpendingLastNDays(n) {
		const currentDate = new Date();
		const dateToSpendingMap = {};

		this.getTransactions().forEach((transaction) => {
			if (transaction.type !== transactionEnum.DEBIT) return;
			const transactionDate = new Date(transaction.date);
			const dateKey = new Date();
			dateKey.setFullYear(transactionDate.getFullYear(), transactionDate.getMonth(), transactionDate.getDate());
			dateKey.setHours(0, 0, 0, 0);
			dateToSpendingMap[dateKey] = (dateToSpendingMap[dateKey] ?? 0) + transaction.amount;
		});

		const resArr = [];

		for (let i = 0; i < n; i++) {
			const dateToCheck = new Date();
			dateToCheck.setDate(currentDate.getDate() - i);
			dateToCheck.setHours(0, 0, 0, 0);
			resArr.push({ date: dateToCheck.toDateString(), total: dateToSpendingMap[dateToCheck] ?? 0 });
		}

		return resArr;
	}

	/**
	 *
	 * @param {Date} date1
	 * @param {Date} date2
	 */
	static isDateEqual(date1, date2) {
		return date1.getDay() === date2.getDay() && date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear();
	}

	static saveWalletToLocalStorage(walletObj) {
		const strWalletObj = JSON.stringify(walletObj);
		// pushing to s3
		axios.post("https://go-microservice-k2dn.onrender.com/wallet/sync", walletObj, {
			withCredentials: true,
		});

		localStorage.setItem(wallet.WALLET_LC_ID, strWalletObj);
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
