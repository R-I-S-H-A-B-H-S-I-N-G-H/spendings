import { useEffect, useState } from "react";
import wallet from "./utils/wallet";
import Transaction from "./utils/transaction";
import transactionEnum from "./utils/enums/transactionEnum";
import Tag from "./utils/tag";
import TagComp from "./components/Tag";
import CustomDropdown from "./components/dropdown";
import Badge from "./components/badge/Badge";
import { InputNumber, Input, Button } from "antd";

function App() {
	const [walletObj, setWalletObj] = useState(null);
	const [triggerRenderVal, setTriggerRenderVal] = useState(false);

	const [selectedLabel, setSelectedLabel] = useState(null);
	const [amount, setAmount] = useState(0);

	const [tagObj, setTagObj] = useState({ name: "", amount, type: transactionEnum.DEBIT });

	useEffect(() => {
		if (walletObj) return;
		// const walletObjTmp = new wallet("My wallet");
		const walletObjTmp = wallet.getWalletFromLocalStorage();

		setWalletObj(walletObjTmp);

		setInterval(() => {
			wallet.saveWalletToLocalStorage(walletObjTmp);
		}, 100);
	});
	if (!walletObj) return <>Loading</>;

	function triggerRender() {
		setTriggerRenderVal((prev) => !prev);
	}

	function addExpense() {
		if (selectedLabel === null) throw new Error("Please select a tag");
		const transaction = new Transaction(amount, transactionEnum.DEBIT, "Random Transaction");
		walletObj.addTransaction(transaction, selectedLabel.value);
		triggerRender();
	}

	function addIncome() {
		const transaction = new Transaction(amount, transactionEnum.CREDIT, "Random Credit");
		walletObj.addTransaction(transaction);
		triggerRender();
	}

	function addTag() {
		walletObj.addTag(new Tag(tagObj.amount, tagObj.type, tagObj.name));
		triggerRender();
	}

	function updateTagAmount(tag, amount) {
		walletObj.updateTagValue(tag, amount);
		triggerRender();
	}

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				// alignItems: "center",
				gap: "10px",
			}}
		>
			<div style={{ display: "flex", gap: "10px" }}>
				<Badge heading={"Total Income"} mainContent={walletObj.getTotalIncome()} />
				<Badge type={"secondary"} heading={"Current Balance"} mainContent={walletObj.getTotalIncome() - walletObj.getTagTotalExpense()} />
				<Badge type={"ternary"} heading={"Total Spendings"} mainContent={walletObj.getTotalExpense()} />
			</div>

			<Input
				style={{ width: "200px" }}
				placeholder="Enter a Tag Name"
				onChange={(e) => {
					setTagObj({ ...tagObj, name: e.target.value });
				}}
			/>

			<InputNumber
				style={{ width: "200px" }}
				placeholder="Enter a Tag Amount"
				type="number"
				onChange={(num) => {
					setTagObj({ ...tagObj, amount: num });
				}}
			/>

			<Button style={{ width: "200px" }} onClick={addTag}>
				Add Tag
			</Button>

			<InputNumber style={{ width: "200px" }} placeholder="Enter a Amount" type="number" onChange={(num) => setAmount(num)} />
			<Button style={{ width: "200px" }} onClick={addExpense}>
				Add Expense
			</Button>
			<Button style={{ width: "200px" }} onClick={addIncome}>
				Add Income
			</Button>
			<CustomDropdown
				options={walletObj
					.getTags()
					.filter((ele) => ele.type === transactionEnum.DEBIT)
					.map((ele) => ({ label: ele.name, value: ele.id }))}
				onChange={setSelectedLabel}
				placeholder="Select an option"
				value={selectedLabel}
			/>

			{walletObj.getTags().map((tag) => {
				return (
					<TagComp
						totalIncome={walletObj.getTotalIncome()}
						type={tag.type}
						key={tag.id}
						id={tag.id}
						amount={tag.amount}
						name={tag.name}
						transactions={walletObj.getTransactions()}
						updateTagAmount={updateTagAmount}
					/>
				);
			})}
		</div>
	);
}

export default App;
