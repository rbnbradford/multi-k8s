export const fibBad = (index: number): number => index < 2 ? 1 : fibBad(index - 1) + fibBad(index - 2);

export const fibGood = (desiredIndex: number): number => {
	const loop = (index: number, previous: number, current: number) => index >= desiredIndex ? current : loop(index + 1, current, current + previous)
	return loop(0, 0, 1);
};

export const fibLong = async (desiredIndex: number): Promise<number> => new Promise(resolve => setTimeout(() => resolve(fibGood(desiredIndex)),3000))
