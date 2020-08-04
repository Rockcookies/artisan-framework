import urllib = require('urllib');
import Agent = require('agentkeepalive');
import { autowired, LoggerProvider, ProviderLifecycle, Namable, value, Ordered } from '@artisan-framework/core';
import { URL } from 'url';
import {
	HttpClientProvider,
	HttpClientProviderConfig,
	HttpRequestOptions,
	HTTP_CLIENT_PROVIDER_CONFIG_KEY,
	HTTP_CLIENT_PROVIDER_ORDER,
} from './http-client-protocol';

export class ArtisanHttpClientProvider implements HttpClientProvider, ProviderLifecycle, Namable, Ordered {
	@autowired(LoggerProvider)
	_logger: LoggerProvider;

	@value(HTTP_CLIENT_PROVIDER_CONFIG_KEY)
	_config?: HttpClientProviderConfig;

	_client: urllib.HttpClient;

	name(): string {
		return 'artisan-http-client';
	}

	order(): number {
		return HTTP_CLIENT_PROVIDER_ORDER;
	}

	async start(): Promise<void> {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { httpAgent = true, httpsAgent = true, sendTrace: _sendTrace, ...restOptions } = this._config || {};

		const options: urllib.RequestOptions = {
			timeout: 5000,
			...restOptions,
			...({ trace: true } as any),
		};

		if (httpAgent) {
			options.agent = new Agent({
				keepAlive: true,
				freeSocketTimeout: 4000,
				maxSockets: Number.MAX_SAFE_INTEGER,
				maxFreeSockets: 256,
				...(httpAgent !== true ? httpAgent : {}),
			});
		}

		if (httpsAgent) {
			options.httpsAgent = new Agent.HttpsAgent({
				keepAlive: true,
				freeSocketTimeout: 4000,
				maxSockets: Number.MAX_SAFE_INTEGER,
				maxFreeSockets: 256,
				...(httpsAgent !== true ? httpsAgent : {}),
			});
		}

		this._client = urllib.create(options);

		this._logger.debug('[http-client] initialized default options', options);
		this._logger.info('[http-client] created');
	}

	async stop(): Promise<void> {
		this._logger.info('[http-client] closed');
	}

	async request<T = any>(url: string | URL, _options?: HttpRequestOptions): Promise<urllib.HttpClientResponse<T>> {
		const { sendTrace = true } = this._config || {};
		const { trace, ...restOptions } = _options || {};

		const options: HttpRequestOptions & Required<Pick<HttpRequestOptions, 'headers'>> = {
			...restOptions,
			headers: {
				...restOptions.headers,
			},
		};

		if (sendTrace && trace) {
			const traceIdField = (sendTrace !== true && sendTrace.traceIdHeaderField) || 'x-trace-id';
			const traceSpanIdField = (sendTrace !== true && sendTrace.traceSpanIdHeaderField) || 'x-trace-span-id';

			options.headers[traceIdField] = trace.traceId;
			options.headers[traceSpanIdField] = trace.spanId;
		}

		return await this._client.request(url, options);
	}
}
