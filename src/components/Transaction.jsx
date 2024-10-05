import moment from "moment";
import transactionEnum from "../utils/enums/transactionEnum";
import { Badge, Button, Text } from "@radix-ui/themes";

export default function Transaction(props) {
	const { amount, type, comment, tag, date, onTransactionDel, id } = props;

	function isCredit() {
		return type == transactionEnum.CREDIT;
	}

	return (
		<div style={{ marginTop: ".5rem", display: "flex", flexDirection: "row", alignItems: "center", justifyItems: "center", gap: "5px" }}>
			<Text size="2" style={{ flex: 1.5 }}>
				{comment}
			</Text>
			<Text size="2" weight={"bold"} color={isCredit() ? "green" : "red"} style={{ flex: 2 }}>{`${!isCredit() ? "-" : "+"}${amount}`}</Text>
			<Text size="2" style={{ flex: 3, padding: "0rem .5rem" }}>
				{moment(date).fromNow()}
			</Text>
			<Button size="1" variant="outline" color="red" onClick={() => onTransactionDel(id)}>
				{"-"}
			</Button>
		</div>
	);
}
