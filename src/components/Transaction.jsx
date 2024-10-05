import moment from "moment";
import transactionEnum from "../utils/enums/transactionEnum";
import { Badge, Button, Text } from "@radix-ui/themes";

export default function Transaction(props) {
	const { amount, type, comment, tag, date, onTransactionDel, id } = props;

	function isCredit() {
		return type == transactionEnum.CREDIT;
	}

	return (
		<div style={{ marginTop: ".5rem", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: "5px" }}>
			<Text size="3" style={{ flex: 1.3 }}>
				{comment}
			</Text>
			<Text size="3" weight={"bold"} color={isCredit() ? "green" : "red"} style={{ flex: 1 }}>{`${!isCredit() ? "-" : "+"}${amount}`}</Text>
			<Text size="2" style={{ flex: 2 }}>
				{moment(date).fromNow()}
			</Text>
			<Button size="1" variant="outline" color="red" onClick={() => onTransactionDel(id)}>
				{"-"}
			</Button>
		</div>
	);
}
