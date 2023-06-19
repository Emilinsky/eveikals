import React, { useEffect, useState } from "react";
import { Range, getTrackBackground } from "react-range";

const STEP = 0.1;
const MIN = 1;
const MAX = 40;

const TwoThumbs = ({ rtl, onPriceChange, value }) => {
	const [values, setValues] = useState(value);

	useEffect(() => {
		onPriceChange(values);
	}, [values]);

	useEffect(() => {
		setValues(value);
	}, [value]);

	return (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				flexWrap: "wrap",
			}}
		>
			<output style={{ color: "#414141" }} id='output'>
				Price Range:
			</output>
			<Range
				values={values}
				step={STEP}
				min={MIN}
				max={MAX}
				rtl={rtl}
				onChange={(values) => {
					setValues(values);
				}}
				renderTrack={({ props, children }) => (
					<div
						onMouseDown={props.onMouseDown}
						onTouchStart={props.onTouchStart}
						style={{
							...props.style,
							height: "36px",
							display: "flex",
							width: "91%",
						}}
					>
						<div
							ref={props.ref}
							style={{
								height: "6px",
								width: "100%",
								borderRadius: "4px",
								background: getTrackBackground({
									values,
									colors: ["#ccc", "#00b48dbc", "#ccc"],
									min: MIN,
									max: MAX,
									rtl,
								}),
								alignSelf: "center",
							}}
						>
							{children}
						</div>
					</div>
				)}
				renderThumb={({ props, isDragged }) => (
					<div
						{...props}
						style={{
							...props.style,
							height: "20px",
							width: "20px",
							borderRadius: "20px",
							backgroundColor: "#00b48dbc",
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							boxShadow: "0px 2px 6px #AAA",
						}}
					>
						<div
							style={{
								height: "14px",
								width: "14px",
								borderRadius: "10px",
								backgroundColor: isDragged ? "#FFF" : "#FFF",
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<div
								style={{
									height: "8px",
									width: "8px",
									borderRadius: "10px",
									backgroundColor: isDragged ? "#00b48dbc" : "#00b48dbc",
								}}
							/>
						</div>
					</div>
				)}
			/>
			<output style={{ color: "#414141" }} id='output'>
				€{values[0].toFixed(2)} - €{values[1].toFixed(2)}
			</output>
		</div>
	);
};

export default TwoThumbs;
