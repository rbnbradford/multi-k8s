type Parser<T> = (x: string) => T | undefined

export const asInteger: Parser<number> = x => {
	const v = parseInt(x);
	return isNaN(v) ? undefined : v;
}

export const asString: Parser<string> = x => x;

const getEnvOrThrowInner = <T>(
	key: string,
	parser: Parser<T>,
	fallback: T | undefined,
): T => {
	const raw = process.env[key];
	if (raw === undefined && fallback) return fallback;
	if (raw === undefined) throw new Error(`env var ${key} not defined`);
	const parsed = parser(raw);
	if (parsed === undefined) throw new Error(`env var ${key} with value ${raw} could not be converted`);
	return parsed;
}

export const getEnvOrThrow: {
	(key: string): string;
	(key: string, fallback: string): string;
	<T>(key: string, parser: Parser<T>): T;
	<T>(key: string, parser: Parser<T>, fallback: T): T;
} = <T>(key: string, parserOrFallbackOrUndefined?: Parser<T> | string, fallbackOrUndefined?: T) => {
	const parser = (typeof parserOrFallbackOrUndefined === 'string' || parserOrFallbackOrUndefined === undefined) ? (x: string): string => x : parserOrFallbackOrUndefined;
	const fallback = typeof parserOrFallbackOrUndefined === 'string' ? parserOrFallbackOrUndefined : fallbackOrUndefined;
	return getEnvOrThrowInner(key, parser, fallback)
}

type GetEnvConfig<T extends object> = {
	[K in keyof T]: (
		| [string, Parser<T[K]>]
		| [string, Parser<T[K]>, T[K]]
		| [string, T[K]]
		)
};

export const getEnvsOrThrow = <T extends object>(config: GetEnvConfig<T>): T => {
	const entries = Object.entries(config)
	const mappedEntries = entries.map(<T>([objKey, [key, parser, fallback]]: [string, [string, Parser<T>, T | undefined]]) => [objKey, () => getEnvOrThrowInner(key, parser, fallback)]);
	return Object.fromEntries(mappedEntries)
};
