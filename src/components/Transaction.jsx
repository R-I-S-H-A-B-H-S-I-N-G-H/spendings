import transactionEnum from "../utils/enums/transactionEnum";

export default function Transaction(props) {
	const { amount, type, comment } = props;

	return (
		<div style={{ margin: ".5rem", display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
			<span>{comment}</span>
			<span>{`${type == transactionEnum.DEBIT ? "-" : "+"}${amount}`}</span>
		</div>
	);
}
