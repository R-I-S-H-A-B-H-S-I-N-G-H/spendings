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
			<Text style={{ flex: 1.5 }}>{comment}</Text>
			<Text weight={"bold"} color={isCredit() ? "green" : "red"} style={{ flex: 1 }}>{`${!isCredit() ? "-" : "+"}${amount}`}</Text>
			<Text style={{ flex: 1 }}>{moment(date).fromNow()}</Text>
			<Button variant="outline" color="red" onClick={() => onTransactionDel(id)}>
				{"-"}
			</Button>
		</div>
	);
}
