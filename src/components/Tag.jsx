import { useState } from "react";
import transactionEnum from "../utils/enums/transactionEnum";
import ProgressLine from "./progressLine/ProgressLine";
import Transaction from "./Transaction";
import Slider from "./slider/Slider";
import { Badge, Button, Flex, Separator } from "@radix-ui/themes";

import { Divider, Tag as TagAnt } from "antd";
export default function Tag(props) {
	let {
		amount,
		name,
		id,
		tagDebitAmount,
		transactions = [],
		type,
		updateTagAmount = () => {},
		totalIncome = 1e5,
		addExpense = () => {},
		isSelectedDateCurrentDate,
		onTransactionDel = () => {},
		addIncome = () => {},
		onTagDel = () => {},
	} = props;
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
		<div
			style={{
				margin: ".5rem",
			}}
		>
			<Flex align={"center"} justify={"between"}>
				{!isCredit() && (
					<>
						<Flex direction={"column"} gap={`1`}>
							<Badge style={{ width: "fit-content" }} onClick={() => onTagDel(id)} size={"3"} color="amber">{`${name} `}</Badge>
							<Badge onClick={() => onTagDel(id)} size={"2"} color="brown">{`${amount} - ${tagDebitAmount} = ${amount - tagDebitAmount}`}</Badge>
						</Flex>
						<Button disabled={!isSelectedDateCurrentDate} size={"2"} variant="soft" color="red" onClick={() => addExpense(id)}>
							log
						</Button>
					</>
				)}
				{isCredit() && (
					<>
						<Badge size={"3"} color="green">{`${name} ${getTagAmount()}`}</Badge>
						<Button disabled={!isSelectedDateCurrentDate} size={"2"} variant="soft" color="green" onClick={() => addIncome()}>
							Add Income
						</Button>
					</>
				)}
			</Flex>
			{getTagTransactions().length > 0 && !isCredit() && (
				<>
					<ProgressLine
						// label={`${name} ${getTagAmount()}`}
						backgroundColor="lightgreen"
						visualParts={[
							{
								percentage: `${getTagSpentPercentage()}%`,
								color: "indianred",
							},
						]}
					/>

					{/* <Slider
						STEP={1}
						MIN={100}
						MAX={totalIncome}
						value={[amount]}
						onChange={(e) => {
							console.log(e);

							updateTagAmountHandler(parseInt(e[0]));
						}}
					/> */}
				</>
			)}

			{/* { <div style={{ fontSize: "1.2rem" }}>Income: {amount}</div>} */}

			<div style={{ marginTop: "1rem" }}>
				{getTagTransactions().map((transaction) => (
					<Transaction key={transaction.id} {...transaction} onTransactionDel={onTransactionDel} />
				))}
			</div>
			{/* <Divider /> */}

			<Separator
				style={{
					width: "100%",
					margin: "2rem 0rem",
				}}
				color="#F9F9F9"
			/>
		</div>
	);
}
