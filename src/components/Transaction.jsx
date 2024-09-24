import moment from "moment";
import transactionEnum from "../utils/enums/transactionEnum";

export default function Transaction(props) {
	const { amount, type, comment, tag, date } = props;

	function isCredit() {
		return type == transactionEnum.CREDIT;
	}

	return (
		<div style={{ marginTop: ".5rem", display: "flex", flexDirection: "row", justifyContent: "space-between", gap: "5px" }}>
			<span style={{ flex: 1.5 }}>{comment}</span>
			<span style={{ flex: 1, fontWeight: "bold", color: isCredit() ? "darkgreen" : "darkred" }}>{`${!isCredit() ? "-" : "+"}${amount}`}</span>
			<span style={{ flex: 1 }}>{moment(date).fromNow()}</span>
		</div>
	);
}
