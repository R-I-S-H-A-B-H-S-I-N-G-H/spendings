import { Badge, Button, Flex } from "@radix-ui/themes";

export default function MonthToggle({ date = new Date(), onChange }) {
	function changeMonth(date, increment = true) {
		const newDate = new Date(date); // Create a copy of the original date

		if (increment) {
			newDate.setMonth(newDate.getMonth() + 1); // Increment the month
		} else {
			newDate.setMonth(newDate.getMonth() - 1); // Decrement the month
		}

		return newDate;
	}

	function onChangeHandler(date) {
		onChange(date);
	}

	return (
		<Flex gap="2" align={"center"} justify={"center"}>
			<Button
				onClick={() => {
					onChangeHandler(changeMonth(date, false));
				}}
				color="red"
				size="2"
				variant="soft"
			>
				{"-"}
			</Button>
            <Button
                onClick={() => {
                    onChangeHandler(new Date());
                }}
                variant="soft" size="3">{`${date.toLocaleString("default", { month: "short" })} ${date.getFullYear()}`}</Button>
			<Button
				onClick={() => {
					onChangeHandler(changeMonth(date, true));
				}}
				color="green"
				size="2"
				variant="soft"
			>
				{"+"}
			</Button>
		</Flex>
	);
}
