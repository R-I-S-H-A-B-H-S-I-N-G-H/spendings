import { Button, Container, Flex, Heading } from "@radix-ui/themes";
import styles from "./Modal.module.css";
import { useEffect } from "react";
import PropTypes from "prop-types";

export default function Modal({ open = true, onOk = () => {}, onCancel = () => {}, children, title = "modal Title" }) {
	useEffect(() => {
		const handleEscape = (e) => {
			if (e.key === "Escape") {
				onCancel();
			}
		};

		if (open) {
			window.addEventListener("keydown", handleEscape);
		} else {
			window.removeEventListener("keydown", handleEscape);
		}

		return () => window.removeEventListener("keydown", handleEscape);
	}, [open, onCancel]);

	if (!open) return null;

	return (
		<div
			className={styles.overlay}
			style={{
				position: "fixed",
				top: 0,
				left: 0,
				width: "100%",
				height: "100%",
				background: "rgba(0, 0, 0, 0.2)",
				display: open ? "flex" : "none",
				alignItems: "center",
				justifyContent: "center",
				zIndex: 9999,
			}}
			onClick={onCancel}
		>
			<Container
				style={{
					position: "relative",
					background: "var(--color-panel)", // Adapts to light or dark theme
					color: "var(--color-text)", // Ensure text color adapts
					padding: "20px",
					borderRadius: "8px",
					maxWidth: "500px",
					width: "100%",
					boxShadow: "var(--shadow-lg)", // Radix box shadow token
				}}
				onClick={(e) => e.stopPropagation()}
			>
				<Heading
					style={{
						margin: ".5rem 0rem",
					}}
				>
					{title}
				</Heading>
				<div>{children}</div>
				<Flex
					style={{
						margin: ".5rem 0rem",
					}}
					align="center"
					justify="end"
					gap="2"
				>
					<Button size="3" color="green" variant="soft" onClick={onOk}>
						OK
					</Button>
					<Button size="3" color="amber" variant="soft" onClick={onCancel}>
						Cancel
					</Button>
				</Flex>
			</Container>
		</div>
	);
}

Modal.propTypes = {
	open: PropTypes.bool.isRequired,
	onOk: PropTypes.func,
	onCancel: PropTypes.func,
	children: PropTypes.node,
};
