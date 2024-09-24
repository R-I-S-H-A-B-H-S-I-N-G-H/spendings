import { useEffect, useState } from "react";
import wallet from "./utils/wallet";
import Transaction from "./utils/transaction";
import transactionEnum from "./utils/enums/transactionEnum";
import Tag from "./utils/tag";
import TagComp from "./components/Tag";
import CustomDropdown from "./components/dropdown";
import Badge from "./components/badge/Badge";
import { InputNumber, Input, Button, Modal } from "antd";

function App() {
	const [walletObj, setWalletObj] = useState(null);
	const [triggerRenderVal, setTriggerRenderVal] = useState(false);
	const [tagObj, setTagObj] = useState({ name: "", amount: 0, type: transactionEnum.DEBIT });
	const [tagCreateModal, setTagCreateModal] = useState(false);
	const [incomeCreateModal, setIncomeCreateModal] = useState(false);
	const [expenseCreateModal, setExpenseCreateModal] = useState(false);
	const [expenseObject, setExpenseObject] = useState({});
	const [incomeObject, setIncomeObject] = useState({});

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
		if (expenseObject.tag === null) throw new Error("Please select a tag");
		if (expenseObject.amount === null) throw new Error("Please enter a valid amount");
		if (expenseObject.name === null) throw new Error("Please enter a valid name");
		const transaction = new Transaction(expenseObject.amount, transactionEnum.DEBIT, expenseObject.name);
		walletObj.addTransaction(transaction, expenseObject.tag);
		closeExpenseModal();
		triggerRender();
	}

	function addIncome() {
		if (incomeObject.amount === null) throw new Error("Please enter a valid amount");
		if (incomeObject.name === null) throw new Error("Please enter a valid name");
		const transaction = new Transaction(incomeObject.amount, transactionEnum.CREDIT, incomeObject.name);
		walletObj.addTransaction(transaction);
		triggerRender();
		closeIncomeModal();
	}

	function addTag() {
		walletObj.addTag(new Tag(tagObj.amount, tagObj.type, tagObj.name));
		triggerRender();
		closeTagModal();
	}

	function updateTagAmount(tag, amount) {
		walletObj.updateTagValue(tag, amount);
		triggerRender();
	}

	function closeTagModal() {
		setTagCreateModal(false);
		resetTagObject();
	}

	function closeExpenseModal() {
		setExpenseCreateModal(false);
	}

	function closeIncomeModal() {
		setIncomeCreateModal(false);
	}

	function resetTagObject() {
		setTagObj({ name: "", amount: 0, type: transactionEnum.DEBIT });
	}

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
			}}
		>
			<div style={{ display: "flex", flexDirection: "column", gap: "10px", justifyContent: "center", width: "100%", marginBottom: "10px" }}>
				<Badge heading={"Total Income"} mainContent={walletObj.getTotalIncome()} />
				<Badge type={"secondary"} heading={"Non Alloted Balance"} mainContent={walletObj.getTotalIncome() - walletObj.getTagTotalExpense()} />
				<Badge type={"ternary"} heading={"Total Spendings"} mainContent={walletObj.getTotalExpense()} />
			</div>

			<Modal title="Add Tag" open={tagCreateModal} onOk={addTag} onCancel={closeTagModal}>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						gap: "10px",
					}}
				>
					<label>Enter Tag Name</label>
					<Input
						styles={{ fontsize: "15px" }}
						value={tagObj.name}
						style={{ width: "200px" }}
						placeholder="Enter a Tag Name"
						onChange={(e) => {
							setTagObj({ ...tagObj, name: e.target.value });
						}}
					/>
					<label>Enter Tag Amount</label>

					<InputNumber
						styles={{ fontsize: "15px" }}
						value={tagObj.amount}
						style={{ width: "200px" }}
						placeholder="Enter a Tag Amount"
						type="number"
						onChange={(num) => {
							setTagObj({ ...tagObj, amount: num });
						}}
					/>
				</div>
			</Modal>

			<Modal title="Add Income" open={incomeCreateModal} onOk={addIncome} onCancel={closeIncomeModal}>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						gap: "10px",
					}}
				>
					<label>Enter Name</label>
					<Input
						value={incomeObject.name}
						style={{ width: "200px", fontsize: "15px" }}
						placeholder="Enter a Name"
						onChange={(e) => setIncomeObject({ ...incomeObject, name: e.target.value })}
					/>
					<label>Enter Amount</label>
					<InputNumber style={{ width: "200px", fontsize: "15px" }} placeholder="Enter a Amount" type="number" onChange={(num) => setIncomeObject({ ...incomeObject, amount: num })} />
				</div>
			</Modal>

			<Modal title="Add Expense" open={expenseCreateModal} onOk={addExpense} onCancel={closeExpenseModal}>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						gap: "10px",
					}}
				>
					<label>Enter Name</label>
					<Input value={expenseObject.name} style={{ width: "200px" }} placeholder="Enter a Name" onChange={(e) => setExpenseObject({ ...expenseObject, name: e.target.value })} />

					<label>Enter Amount</label>
					<InputNumber
						value={expenseObject.amount}
						style={{ width: "200px", fontsize: "15px" }}
						placeholder="Enter a Amount"
						type="number"
						onChange={(num) => setExpenseObject({ ...expenseObject, amount: num })}
					/>
					<CustomDropdown
						options={walletObj
							.getTags()
							.filter((ele) => ele.type === transactionEnum.DEBIT)
							.map((ele) => ({ label: ele.name, value: ele.id }))}
						onChange={({ value }) => {
							setExpenseObject({ ...expenseObject, tag: value });
						}}
						placeholder="Select an option"
					/>
				</div>
			</Modal>

			<div
				style={{
					display: "flex",
					justifyContent: "center",
					gap: "10px",
					margin: "10px",
				}}
			>
				<Button color="primary" variant="filled" style={{ width: "200px" }} onClick={() => setTagCreateModal(true)}>
					Add Tag
				</Button>

				<Button style={{ width: "200px" }} onClick={() => setIncomeCreateModal(true)}>
					Add Income
				</Button>

				<Button color="danger" variant="filled" style={{ width: "200px" }} onClick={() => setExpenseCreateModal(true)}>
					Add Expense
				</Button>
			</div>

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
