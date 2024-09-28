import { useEffect, useState } from "react";
import wallet from "./utils/wallet";
import Transaction from "./utils/transaction";
import transactionEnum from "./utils/enums/transactionEnum";
import Tag from "./utils/tag";
import TagComp from "./components/Tag";
import CustomDropdown from "./components/dropdown";
import Badge from "./components/badge/Badge";
import { InputNumber, Input, Modal } from "antd";
import { Button, Card, Flex, Grid } from "@radix-ui/themes";
import MonthToggle from "./components/monthToggle/MonthToggle";

function App() {
	const [walletObj, setWalletObj] = useState(null);
	const [triggerRenderVal, setTriggerRenderVal] = useState(false);
	const [tagObj, setTagObj] = useState({ name: "", amount: 0, type: transactionEnum.DEBIT });
	const [tagCreateModal, setTagCreateModal] = useState(false);
	const [incomeCreateModal, setIncomeCreateModal] = useState(false);
	const [expenseCreateModal, setExpenseCreateModal] = useState(false);
	const [expenseObject, setExpenseObject] = useState({});
	const [incomeObject, setIncomeObject] = useState({});
	const [selectedDate, setSelectedDate] = useState(new Date());

	useEffect(() => {
		if (walletObj) return;
		// const walletObjTmp = new wallet("My wallet");
		const walletObjTmp = wallet.getWalletFromLocalStorage();

		setWalletObj(walletObjTmp);

		setInterval(() => {
			wallet.saveWalletToLocalStorage(walletObjTmp);
		}, 100);
	});

	useEffect(() => {
		if (!walletObj) return;
		walletObj.dateFilter.month = selectedDate.getMonth();
		walletObj.dateFilter.year = selectedDate.getFullYear();
		setTriggerRenderVal((prev) => !prev);
	}, [selectedDate]);

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

	function onAddExpenseHandler(tagId) {
		setExpenseObject({ tag: tagId, amount: null, name: null });
		setExpenseCreateModal(true);
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

	function isSelectedDateCurrentDate() {
		return selectedDate.getMonth() === new Date().getMonth() && selectedDate.getFullYear() === new Date().getFullYear();
	}

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				padding: "2rem",
			}}
		>
			<Flex align={"center"} justify={"center"}>
				<Grid columns={{ base: "1", md: "3" }} gap="3" rows={{ base: "auto", md: "repeat(2, 64px)" }} width="auto">
					<Badge heading={"Total Income"} mainContent={walletObj.getTotalIncome()} />
					<Badge type={"secondary"} heading={"Non Alloted Balance"} mainContent={walletObj.getTotalIncome() - walletObj.getTagTotalExpense()} />
					<Badge type={"ternary"} heading={"Total Spendings"} mainContent={walletObj.getTotalExpense()} />
				</Grid>
			</Flex>

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
						style={{ fontSize: "17px" }}
						value={tagObj.name}
						placeholder="Enter a Tag Name"
						onChange={(e) => {
							setTagObj({ ...tagObj, name: e.target.value });
						}}
					/>
					<label>Enter Tag Amount</label>

					<InputNumber
						value={tagObj.amount}
						style={{ width: "200px", fontSize: "17px" }}
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
						style={{ width: "200px", fontSize: "17px" }}
						placeholder="Enter a Name"
						onChange={(e) => setIncomeObject({ ...incomeObject, name: e.target.value })}
					/>
					<label>Enter Amount</label>
					<InputNumber style={{ width: "200px", fontSize: "17px" }} placeholder="Enter a Amount" type="number" onChange={(num) => setIncomeObject({ ...incomeObject, amount: num })} />
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
					<Input
						value={expenseObject.name}
						style={{ width: "200px", fontSize: "17px" }}
						placeholder="Enter a Name"
						onChange={(e) => setExpenseObject({ ...expenseObject, name: e.target.value })}
					/>

					<label>Enter Amount</label>
					<InputNumber
						value={expenseObject.amount}
						style={{ width: "200px", fontSize: "17px" }}
						placeholder="Enter a Amount"
						type="number"
						onChange={(num) => setExpenseObject({ ...expenseObject, amount: num })}
					/>
					<CustomDropdown
						value={{ value: expenseObject.tag, label: walletObj.getTags().find((ele) => ele.id === expenseObject.tag)?.name }}
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
				<Button disabled={!isSelectedDateCurrentDate()} size={"3"} variant="soft" color="purple" onClick={() => setTagCreateModal(true)}>
					Add Tag
				</Button>

				<Button disabled={!isSelectedDateCurrentDate()} size={"3"} variant="soft" color="green" onClick={() => setIncomeCreateModal(true)}>
					Add Income
				</Button>

				{/* <Button size={"3"} variant="soft" color="red" onClick={() => setExpenseCreateModal(true)}>
					Add Expense
				</Button> */}
			</div>

			<MonthToggle date={selectedDate} onChange={setSelectedDate} />

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
						addExpense={onAddExpenseHandler}
						isSelectedDateCurrentDate={isSelectedDateCurrentDate()}
					/>
				);
			})}
		</div>
	);
}

export default App;
