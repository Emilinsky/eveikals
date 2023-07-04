import confetti from "canvas-confetti";

export const runFireworks = () => {
	var end = Date.now() + 2 * 500;

	// go Buckeyes!
	var colors = ["#07d3a7", "#048987", "#00dcc6"];

	(function frame() {
		confetti({
			particleCount: 3,
			angle: 60,
			spread: 45,
			origin: { x: 0, y: 0.8 },
			colors: colors,
		});
		confetti({
			particleCount: 3,
			angle: 120,
			spread: 45,
			origin: { x: 1, y: 0.8 },
			colors: colors,
		});

		if (Date.now() < end) {
			requestAnimationFrame(frame);
		}
	})();
};
