import {
	pressComposition,
	tapComposition,
	useComposedGesture,
	type GestureCallback
} from 'svelte-gestures';

type DynamicPressOptions = {
	/** How many milliseconds until a tap turns into a press.
	 * Default: 300
	 */
	timeframe?: number;

	/**
	 * If a long press is captured, trigger the callback before the user releases?
	 * Default: false
	 */
	triggerBeforeFinished?: boolean;

	/**
	 * Called when user taps.
	 */
	ontap?: () => unknown;

	/**
	 * Called when user long presses.
	 */
	onpress?: () => unknown;
};

/**
 * A composed gesture that listens to both normal taps and long presses,
 * with separate callbacks for each one.
 */
export const useDynamicPress = (opts?: DynamicPressOptions) => {
	// combine tap and press into one gesture
	const gesture: GestureCallback = (register) => {
		const tapFuncs = register(tapComposition, {
			composed: true,
			timeframe: opts?.timeframe ?? 300
		});

		const pressFuncs = register(pressComposition, {
			composed: true,
			timeframe: opts?.timeframe ?? 300,
			triggerBeforeFinished: opts?.triggerBeforeFinished ?? false
		});

		return (activeEvents, event) => {
			tapFuncs.onMove?.(activeEvents, event);
			pressFuncs.onMove?.(activeEvents, event);
		};
	};

	return useComposedGesture(gesture, {
		ontap: opts?.ontap,
		onpress: opts?.onpress
	});
};
