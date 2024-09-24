import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

export default function CustomDropdown(props) {
	const { options, onChange, value, placeholder } = props;

	return <Dropdown options={options} onChange={onChange} value={value} placeholder={placeholder} />;
}
