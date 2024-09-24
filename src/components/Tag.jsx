import { useState } from "react";
import transactionEnum from "../utils/enums/transactionEnum";
import ProgressLine from "./progressLine/ProgressLine";
import Transaction from "./Transaction";
import Slider from "./slider/Slider";
export default function Tag(props) {
	let { amount, name, id, transactions = [], type, updateTagAmount = () => {}, totalIncome = 1e5 } = props;
	if (!Array.isArray(transactions)) throw new Error("Transactions must be an array");
	if (!totalIncome) totalIncome = 1e6;

	function getTagTransactions() {
		return transactions.filter((transaction) => transaction.tag.id == id);
	}

	function getTagSpent() {
		// add initial value

		return getTagTransactions().reduce((acc, transaction) => {
			return acc + transaction.amount;
		}, 0);
	}

	function getTagSpentPercentage() {
		return (getTagSpent() / amount) * 100;
	}

	function getTagAmount() {
		if (isCredit()) return "";
		return -amount;
	}

	function isCredit() {
		return type == transactionEnum.CREDIT;
	}

	function updateTagAmountHandler(amount) {
		if (!amount) throw new Error("Amount must be provided");
		updateTagAmount(id, amount);
	}

	return (
		<>
			{!isCredit() && (
				<>
					<ProgressLine
						label={`${name} ${getTagAmount()}`}
						backgroundColor="lightgreen"
						visualParts={[
							{
								percentage: `${getTagSpentPercentage()}%`,
								color: "indianred",
							},
						]}
					/>

					<Slider
						STEP={1}
						MIN={100}
						MAX={totalIncome}
						value={[amount]}
						onChange={(e) => {
							console.log(e);

							updateTagAmountHandler(parseInt(e[0]));
						}}
					/>
				</>
			)}

			{getTagTransactions().map((transaction) => (
				<Transaction key={transaction.id} {...transaction} />
			))}
		</>
	);
}
