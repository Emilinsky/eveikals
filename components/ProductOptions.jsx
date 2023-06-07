import React from "react";

import { FaCheck } from "react-icons/fa";
import { Tooltip } from "react-tooltip";

function getPerceivedBrightness(color) {
	if (!color) {
		return 0;
	}

	// hex color format
	const rgb = color.slice(1);

	if (rgb.length !== 6) {
		return 0;
	}

	const r = parseInt(rgb.slice(0, 2), 16);
	const g = parseInt(rgb.slice(2, 4), 16);
	const b = parseInt(rgb.slice(4, 6), 16);

	const brightness = (r * 299 + g * 587 + b * 114) / 1000;

	return brightness;
}

function ProductOptions({ options, selectedOptions, handleOptionChange }) {
	return (
		<div className='options-cont'>
			{options.map((option) => (
				<div key={option._key} className={`div-cont ${option.name.toLowerCase() === "size" ? "size-option" : ""}`}>
					<label className='option-title'>{option.name}:</label>
					<div className='input-cont'>
						{option.values.map((value, index) => {
							const isChecked = selectedOptions[option.name] === value.title;
							const isColorOption = option.name.toLowerCase() === "color";
							let checkmarkColor = "#ffffff";
							if (isColorOption && isChecked) {
								const backgroundColor = value.colors[0];
								const brightness = getPerceivedBrightness(backgroundColor);
								checkmarkColor = brightness > 215 ? "#366bc0ec" : "#ffffff";
							}

							return (
								<div key={value._key} className='labels product-color'>
									<input
										type='radio'
										value={value.title}
										id={value.title}
										checked={isChecked}
										onChange={(e) => handleOptionChange(option.name, e.target.value)}
										style={{ display: "none" }}
									/>
									<label
										data-tooltip-id={isColorOption ? "my-tooltip" : undefined}
										data-tooltip-content={isColorOption ? value.title : undefined}
										htmlFor={value.title}
										style={{
											backgroundColor: isColorOption ? value.colors[0] : null,
											color: isChecked && isColorOption ? checkmarkColor : null,
										}}
									>
										{/* Only display the color name if it's checked */}
										{isChecked && isColorOption && <FaCheck size={15} />}
										{!isColorOption && value.title}
									</label>
									<Tooltip
										id='my-tooltip'
										place='top'
										variant='info'
										style={{
											paddingLeft: 25,
											paddingRight: 25,
											paddingTop: 13,
											paddingBottom: 13,
											backgroundColor: "#366bc0ec",
											borderRadius: 6,
										}}
									/>
								</div>
							);
						})}
					</div>
				</div>
			))}
		</div>
	);
}

export default ProductOptions;
