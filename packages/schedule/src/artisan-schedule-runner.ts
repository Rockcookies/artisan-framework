import { ArtisanException, LoggerProvider, TraceContext, createTraceContext } from '@artisan-framework/core';
import { parseExpression } from 'cron-parser';
import { ScheduleOptions, ScheduleTask } from './schedule-protocol';
import safeTimers = require('safe-timers');
import ms = require('humanize-ms');
import dayJs = require('dayjs');

export class ArtisanScheduleRunner {
	private _schedule: ScheduleOptions;
	private _task: ScheduleTask;
	private _cronExpression?: ReturnType<typeof parseExpression>;
	private _name: string;
	private _logger: LoggerProvider;
	private _closed = false;
	private _executeCount = 0;
	private _execution?: [TraceContext, Promise<void>];

	constructor(task: ScheduleTask, options: { logger: LoggerProvider }) {
		this._schedule = task.schedule();
		this._name = task.name();

		this._task = task;
		this._logger = options.logger;

		const { interval, cron, immediate } = this._schedule;

		if (interval == null && cron == null && immediate == null) {
			throw new ArtisanException(
				`Schedule task<${this._name}> configuration 'interval' or 'cron' or 'immediate' is required`,
			);
		}

		if (cron) {
			const { expression, ...cronOptions } = cron;

			try {
				this._cronExpression = parseExpression(expression, cronOptions);
			} catch (err) {
				err.message = `[schedule] task<${this._name}> parse cron instruction(${expression}) error: ${err.message}`;
				throw err;
			}
		}
	}

	start(): void {
		if (this._schedule.disable) {
			this._logger.warn(`[schedule] task<${this._name}> disable`);
			return;
		}

		if (this._schedule.immediate) {
			this._logger.info(`[schedule] task<${this._name}> next time will execute immediate`);
			setImmediate(() => this.run());
		} else {
			this.next();
		}
	}

	async stop(): Promise<void> {
		if (this._closed) {
			return;
		} else {
			this._closed = true;
		}

		if (this._execution != null) {
			const [trace, execution] = this._execution;
			this._logger.warn(`[schedule] waiting for task<${this._name}> completion...`, { trace });
			await execution;
		}

		this._logger.info(`[schedule] task<${this._name}> stopped`);
	}

	run() {
		const trace: TraceContext = createTraceContext();

		this._execution = [
			trace,
			this._run(trace)
				.then(() => {
					this._execution = undefined;
					this.next();
				})
				.catch(() => {
					this._execution = undefined;
					this.next();
				}),
		];
	}

	async _run(trace: TraceContext): Promise<void> {
		this._executeCount++;
		const count = this._executeCount;
		const startTime = Date.now();

		const logger = this._logger.with({ trace, execute_count: count });

		logger.info(`[schedule] execute task<${this._name}>`);

		try {
			await this._task.task({ trace });
			logger.info(`[schedule] task<${this._name}> execute success`, {
				execution_time: Date.now() - startTime,
			});
		} catch (err) {
			logger.error(`[schedule] task<${this._name}> execute error: ${err}`, {
				execution_time: Date.now() - startTime,
				err,
			});
		}
	}

	next() {
		if (this._closed) {
			return;
		}

		let delay: number | undefined;

		if (this._schedule.interval) {
			delay = ms(this._schedule.interval);
		} else if (this._cronExpression) {
			// calculate next cron tick
			const now = Date.now();
			let nextTick: number;
			let nextInterval;

			// loop to find next feature time
			do {
				try {
					nextInterval = this._cronExpression.next();
					nextTick = nextInterval.getTime();
				} catch (err) {
					// Error: Out of the timespan range
					return;
				}
			} while (now >= nextTick);

			delay = nextTick - now;
		}

		if (delay == null) {
			this._logger.info(`[schedule] task<${this._name}> reach endDate, will stop`);
			return;
		}

		this._logger.info(
			`[schedule] task<${this._name}> next time will execute after ${delay}ms at ${dayJs(
				Date.now() + delay,
			).format('YYYY-MM-DD HH:mm:ss:SSS')}`,
		);

		const nextTick = delay < safeTimers.maxInterval ? setTimeout : safeTimers.setTimeout;
		nextTick(() => this.run(), delay);
	}
}
