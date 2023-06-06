import React, { useEffect, useState } from "react";
import { Range, getTrackBackground } from "react-range";

const STEP = 1;
const MIN = 1;
const MAX = 50;

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
							width: "100%",
						}}
					>
						<div
							ref={props.ref}
							style={{
								height: "5px",
								width: "100%",
								borderRadius: "4px",
								background: getTrackBackground({
									values,
									colors: ["#ccc", "#548BF4", "#ccc"],
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
							height: "42px",
							width: "42px",
							borderRadius: "4px",
							backgroundColor: "#FFF",
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							boxShadow: "0px 2px 6px #AAA",
						}}
					>
						<div
							style={{
								height: "16px",
								width: "5px",
								backgroundColor: isDragged ? "#548BF4" : "#CCC",
							}}
						/>
					</div>
				)}
			/>
			<output style={{ marginTop: "30px" }} id='output'>
				{values[0].toFixed(1)} - {values[1].toFixed(1)}
			</output>
		</div>
	);
};

export default TwoThumbs;
