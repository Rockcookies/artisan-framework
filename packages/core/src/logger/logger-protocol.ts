import { Dictionary } from '../interfaces';

export const LoggerProvider = Symbol('LoggerProvider');

export type LogFunction = (message: string, meta?: Dictionary) => void;

export interface LoggerProvider {
	error: LogFunction;
	warn: LogFunction;
	info: LogFunction;
	debug: LogFunction;
	tag: (name: string) => LoggerProvider;
	with: (ctx: Dictionary) => LoggerProvider;
}
