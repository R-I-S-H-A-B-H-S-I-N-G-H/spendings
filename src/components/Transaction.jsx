import moment from "moment";
import transactionEnum from "../utils/enums/transactionEnum";
import { Badge, Button, Text } from "@radix-ui/themes";

export default function Transaction(props) {
	const { amount, type, comment, tag, date, onTransactionDel, id } = props;

	function isCredit() {
		return type == transactionEnum.CREDIT;
	}

	function isDateToday(dateStr) {
		if (dateStr == null) return false;
		const date = new Date(dateStr);
		const todayDate = new Date();
		return todayDate.getDate() == date.getDate() && todayDate.getMonth() == date.getMonth() && todayDate.getFullYear() == date.getFullYear();
	}

	return (
		<div style={{ marginTop: ".5rem", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: "5px" }}>
			<Text size="2" style={{ flex: 1.5 }}>
				{comment}
			</Text>
			<Text align={"center"} size="2" weight={"bold"} color={isCredit() ? "green" : "red"} style={{ flex: 2 }}>{`${!isCredit() ? "-" : "+"}${amount}`}</Text>
			<Text size="2" style={{ padding: "0rem .5rem" }}>
				{isDateToday(date) ? moment(date).fromNow() : moment(date).format("Do MMM YY")}
			</Text>
			<Button size="1" variant="outline" color="red" onClick={() => onTransactionDel(id)}>
				{"-"}
			</Button>
		</div>
	);
}
