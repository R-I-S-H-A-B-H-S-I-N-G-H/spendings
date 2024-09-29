import { Container, Flex, Heading, Text, Badge as BadgeRadix } from "@radix-ui/themes";
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
		// <div style={{ ...styleObject[type] }} className={style.container}>
		<Container size="2" style={{}}>
			<BadgeRadix
				style={{
					padding: "1rem",
				}}
				color={type == "primary" ? "green" : type == "secondary" ? "amber" : "red"}
				size="3"
			>
				<Flex direction={"column"} justify={"center"} align={"center"}>
					<Heading as="h4" weight={"bold"} color={type == "primary" ? "green" : type == "secondary" ? "amber" : "red"}>
						{heading}
					</Heading>
					<Text weight={"bold"} color={type == "primary" ? "green" : type == "secondary" ? "amber" : "red"}>
						{mainContent}
					</Text>
				</Flex>
			</BadgeRadix>
		</Container>
		// </div>
	);
}
