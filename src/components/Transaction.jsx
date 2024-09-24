import moment from "moment";
import transactionEnum from "../utils/enums/transactionEnum";

export default function Transaction(props) {
	const { amount, type, comment, tag, date } = props;

	return (
		<div style={{ margin: ".5rem", display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
			<span style={{ flex: 2 }}>{comment}</span>
			<span style={{ flex: 2 }}>{`${type == transactionEnum.DEBIT ? "-" : "+"}${amount}`}</span>
			<span style={{ flex: 1 }}>{moment(date).fromNow()}</span>
		</div>
	);
}
