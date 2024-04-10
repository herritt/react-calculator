import React, { useState } from "react";

import "./App.css";
import Wrapper from "./components/Wrapper/Wrapper";
import Screen from "./components/Screen/Screen";
import ButtonContainer from "./components/ButtonContainer/ButtonContainer";
import Button from "./components/Button/Button";

const buttonValues = [
	"AC",
	"+/-",
	"%",
	"/",
	"7",
	"8",
	"9",
	"x",
	"4",
	"5",
	"6",
	"-",
	"1",
	"2",
	"3",
	"+",
	"0",
	".",
	"=",
];

const removeSpaces = (num) => num.toString().replace(/\s/g, "");

const toLocalString = (num) => String(num).replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, "$1 ");

const math = (a, b, sign) =>
	sign === "+" ? a + b : sign === "-" ? a - b : sign === "x" ? a * b : sign === "/" ? a / b : 0;

const App = () => {
	let [calc, setCalc] = useState({
		sign: "",
		num: 0,
		res: 0,
	});

	const numClickHandler = (e) => {
		e.preventDefault();
		const value = e.target.innerHTML;
		setCalc({
			...calc,
			num:
				removeSpaces(calc.num) % 1 === 0 && !calc.num.toString().includes(".")
					? toLocalString(Number(removeSpaces(calc.num + value)))
					: toLocalString(calc.num + value),
			res: !calc.sign ? 0 : calc.res,
		});
	};

	const resetClickHandler = () => {
		setCalc({
			sign: "",
			num: 0,
			res: 0,
		});
	};

	const equalClickHandler = () => {
		if (calc.sign && calc.num) {
			setCalc({
				...calc,
				res:
					calc.num === "0" && calc.sign === "/"
						? "Error"
						: math(Number(removeSpaces(calc.res)), Number(removeSpaces(calc.num)), calc.sign),
				sign: "",
				num: 0,
			});
		}
	};

	const signClickHandler = (e) => {
		setCalc({
			...calc,
			sign: e.target.innerHTML,
			res: !calc.num
				? calc.res
				: !calc.res
				? calc.num
				: toLocalString(
						math(Number(removeSpaces(calc.res)), Number(removeSpaces(calc.num)), calc.sign)
				  ),
			num: 0,
		});
	};

	const invertClickHandler = () => {
		setCalc({
			...calc,
			num: calc.num ? toLocalString(removeSpaces(calc.num) * -1) : 0,
			res: calc.res ? toLocalString(removeSpaces(calc.res) * -1) : 0,
			sign: "",
		});
	};

	const percentClickHandler = () => {
		let num = calc.num ? parseFloat(removeSpaces(calc.num)) : 0;
		let res = calc.res ? parseFloat(removeSpaces(calc.res)) : 0;
		setCalc({
			...calc,
			num: (num * 10 ** 16) / 10 ** 18,
			res: (res * 10 ** 16) / 10 ** 18,
			sign: "",
		});
	};

	const commaClickHandler = (e) => {
		e.preventDefault();
		let value = e.target.innerHTML;
		setCalc({
			...calc,
			num: calc.num.toString().includes(".") ? calc.num : calc.num + value,
			res: 0,
		});
	};

	const buttonClickHandler = (e, button) => {
		button === "AC" || calc.res === "Error"
			? resetClickHandler()
			: button === "+/-"
			? invertClickHandler()
			: button === "%"
			? percentClickHandler()
			: button === "="
			? equalClickHandler()
			: button === "+" || button === "-" || button === "x" || button === "/"
			? signClickHandler(e)
			: button === "."
			? commaClickHandler(e)
			: numClickHandler(e);
	};

	return (
		<Wrapper>
			<Screen value={calc.num ? calc.num : calc.res} />
			<ButtonContainer>
				{buttonValues.flat().map((button, index) => {
					return (
						<Button
							key={index}
							className={button === "=" ? "equals" : ""}
							value={button}
							onClick={(e) => buttonClickHandler(e, button)}
						/>
					);
				})}
			</ButtonContainer>
		</Wrapper>
	);
};

export default App;
