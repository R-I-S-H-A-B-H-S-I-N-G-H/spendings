import style from "./Badge.module.css";

export default function Badge(props) {
	const { heading = "--", mainContent = "--", type = "primary" } = props;
	const styleObject = {
		primary: {
			backgroundColor: "#f2fcf8",
		},
		secondary: {
			backgroundColor: "#F9F4FF",
		},
		ternary: {
			backgroundColor: "#FFF2F7",
		},
	};

	return (
		<div style={{ ...styleObject[type] }} className={style.container}>
			<div className={style.heading}>{heading}</div>
			<div className={style.mainContent}>{mainContent}</div>
		</div>
	);
}
