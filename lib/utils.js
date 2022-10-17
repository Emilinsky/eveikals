import confetti from "canvas-confetti";

export const runFireworks = () => {
	var end = Date.now() + 5 * 1000;

	// go Buckeyes!
	var colors = ["#f02d34", "#002360"];

	(function frame() {
		confetti({
			particleCount: 2,
			angle: 60,
			spread: 45,
			origin: { x: 0, y: .8 },
			colors: colors,
		});
		confetti({
			particleCount: 2,
			angle: 120,
			spread: 45,
			origin: { x: 1, y:.8 },
			colors: colors,
		});

		if (Date.now() < end) {
			requestAnimationFrame(frame);
		}
	})();
};
