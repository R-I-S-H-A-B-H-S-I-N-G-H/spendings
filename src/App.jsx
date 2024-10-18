import { useEffect, useState } from "react";
import wallet from "./utils/wallet";
import Transaction from "./utils/transaction";
import transactionEnum from "./utils/enums/transactionEnum";
import Tag from "./utils/tag";
import TagComp from "./components/Tag";
import CustomDropdown from "./components/dropdown";
import Badge from "./components/badge/Badge";
import { InputNumber, Input } from "antd";
import { Button, Card, Container, Flex, Grid, Text } from "@radix-ui/themes";
import MonthToggle from "./components/monthToggle/MonthToggle";
import ModalComp from "./components/modal/ModalComp";
import toast, { Toaster } from "react-hot-toast";
import Bar from "./components/charts/bar/Bar";
import Line from "./components/charts/line/Line";

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
	const [transactionDelModal, setTransactionDelModal] = useState(false);
	const [deleteTransactionId, setDeleteTransactionId] = useState();
	const [deleteTagId, setDeleteTagId] = useState();
	const [tagDelModal, setTagDelModal] = useState(false);

	function getLast7DayExpenseChartData() {
		const last7DaysSpending = walletObj?.getTotalSpendingLastNDays(7) ?? [];
		let labels = [];
		let data = [];
		for (let ele of last7DaysSpending) {
			labels.push(ele.date);
			data.push(ele.total);
		}

		return { labels: labels.reverse(), data: data.reverse() };
	}

	useEffect(() => {
		if (walletObj) return;
		// const walletObjTmp = new wallet("My wallet");
		const walletObjTmp = wallet.getWalletFromLocalStorage();

		setWalletObj(walletObjTmp);
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
		try {
			if (expenseObject.tag === null) throw new Error("Please select a tag");
			if (expenseObject.amount === null) throw new Error("Please enter a valid amount");
			if (expenseObject.name === null) throw new Error("Please enter a valid name");
			const transaction = new Transaction(expenseObject.amount, transactionEnum.DEBIT, expenseObject.name);
			walletObj.addTransaction(transaction, expenseObject.tag);
			closeExpenseModal();
			triggerRender();
			toast.success("Successfully added expense");
		} catch (e) {
			toast.error(e.message);
		}
	}

	function onAddExpenseHandler(tagId) {
		setExpenseObject({ tag: tagId, amount: null, name: null });
		setExpenseCreateModal(true);
	}

	function addIncome() {
		try {
			if (!incomeObject.amount) throw new Error("Please enter a valid amount");
			if (!incomeObject.name) throw new Error("Please enter a valid name");
			const transaction = new Transaction(incomeObject.amount, transactionEnum.CREDIT, incomeObject.name);
			walletObj.addTransaction(transaction);
			triggerRender();
			closeIncomeModal();
			toast.success("Successfully added income");
		} catch (e) {
			toast.error(e.message);
		}
	}

	function addTag() {
		try {
			walletObj.addTag(new Tag(tagObj.amount, tagObj.type, tagObj.name));
			triggerRender();
			closeTagModal();
			toast.success("Successfully added tag");
		} catch (e) {
			toast.error(e.message);
		}
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

	function onTransactionDelHandler(transactionId) {
		setDeleteTransactionId(transactionId);
		setTransactionDelModal(true);
	}

	function onTagDelHandler(id) {
		setDeleteTagId(id);
		setTagDelModal(true);
	}

	function closeDelTagModal() {
		setDeleteTagId();
		setTagDelModal(false);
	}

	function addIncomeHandler() {
		setIncomeCreateModal(true);
	}

	function closeDelTransactionModal() {
		setDeleteTransactionId();
		setTransactionDelModal(false);
	}

	function deleteTag(id) {
		try {
			walletObj.deleteTag(id);
			toast.success("tag deleted");
		} catch (e) {
			toast.error(e.message);
		}
		closeDelTagModal();
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
			<Toaster containerStyle={{ zIndex: 999999 }} position="top-right" reverseOrder={false} />
			<Flex align={"center"} justify={"center"}>
				<Flex direction={window.innerWidth < 700 ? "column" : "row"} align={"center"} justify={"center"} gap="3">
					<Badge heading={"Total Income"} mainContent={walletObj.getTotalIncome()} />
					<Badge type={"secondary"} heading={"Non Budget Balance"} mainContent={walletObj.getTotalIncome() - walletObj.getTagTotalExpense()} />
					<Badge type={"ternary"} heading={"Total Spendings"} mainContent={walletObj.getTotalExpense()} />
				</Flex>
			</Flex>
			<div
				style={{
					width: "100%",
				}}
			>
				{/* <Line {...getLast7DayExpenseChartData()} /> */}
				<Bar {...getLast7DayExpenseChartData()} />
			</div>
			<ModalComp
				open={transactionDelModal}
				title="Delete transaction?"
				onOk={() => {
					walletObj.deleteTransaction(deleteTransactionId);
					closeDelTransactionModal();
				}}
				onCancel={() => {
					closeDelTransactionModal();
				}}
			/>

			<ModalComp
				open={tagDelModal}
				title="Delete Tag?"
				onOk={() => {
					deleteTag(deleteTagId);
				}}
				onCancel={() => {
					closeDelTagModal();
				}}
			/>

			<ModalComp title="Add Tag" open={tagCreateModal} onOk={addTag} onCancel={closeTagModal}>
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
			</ModalComp>
			<ModalComp title="Add Income" open={incomeCreateModal} onOk={addIncome} onCancel={closeIncomeModal}>
				<Flex direction="column" style={{ gap: "6px" }}>
					<Text weight="medium">Enter Name</Text>
					<Input
						value={incomeObject.name}
						style={{ width: "200px", fontSize: "17px" }}
						placeholder="Enter a Name"
						onChange={(e) => setIncomeObject({ ...incomeObject, name: e.target.value })}
					/>
					<Text medium="bold">Enter Amount</Text>
					<InputNumber style={{ width: "200px", fontSize: "17px" }} placeholder="Enter a Amount" type="number" onChange={(num) => setIncomeObject({ ...incomeObject, amount: num })} />
				</Flex>
			</ModalComp>
			<ModalComp title="Add Expense" open={expenseCreateModal} onOk={addExpense} onCancel={closeExpenseModal}>
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
			</ModalComp>
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

				{/* <Button disabled={!isSelectedDateCurrentDate()} size={"3"} variant="soft" color="green" onClick={() => setIncomeCreateModal(true)}>
					Add Income
				</Button> */}

				{/* <Button size={"3"} variant="soft" color="red" onClick={() => setExpenseCreateModal(true)}>
					Add Expense
				</Button> */}
			</div>

			<MonthToggle date={selectedDate} onChange={setSelectedDate} />

			{walletObj
				.getTags()
				.sort((tag1, tag2) => -(tag1.amount / walletObj.getDebitAmount(tag1.id) - tag2.amount / walletObj.getDebitAmount(tag2.id)))
				.map((tag) => {
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
							onTransactionDel={onTransactionDelHandler}
							addIncome={addIncomeHandler}
							onTagDel={onTagDelHandler}
							tagDebitAmount={walletObj.getDebitAmount(tag.id)}
						/>
					);
				})}
		</div>
	);
}

export default App;
