import { ArtisanError, Dictionary } from '@artisan-framework/core';
import { HttpErrorOptions } from './error-protocol';

const MESSAGES: Dictionary<string> = {
	400: 'Bad Request',
	401: 'Unauthorized',
	402: 'Payment Required',
	403: 'Forbidden',
	404: 'Not Found',
	405: 'Method Not Allowed',
	406: 'Not Acceptable',
	407: 'Proxy Authentication Required',
	408: 'Request Timeout',
	409: 'Conflict',
	410: 'Gone',
	411: 'Length Required',
	412: 'Precondition Failed',
	413: 'Request Entity Too Large',
	414: 'Request URI Too Long',
	415: 'Unsupported Media Type',
	416: 'Requested Range Not Satisfiable',
	417: 'Expectation Failed',
	418: "I'm a teapot",
	421: 'Misdirected Request',
	422: 'Unprocessable Entity',
	423: 'Locked',
	424: 'Failed Dependency',
	425: 'Too Early',
	426: 'Upgrade Required',
	428: 'Precondition Required',
	429: 'Too Many Requests',
	431: 'Request Header Fields Too Large',
	451: 'Unavailable For Legal Reasons',
	500: 'Internal Server Error',
	501: 'Not Implemented',
	502: 'Bad Gateway',
	503: 'Service Unavailable',
	504: 'Gateway Timeout',
	505: 'HTTP Version Not Supported',
	506: 'Variant Also Negotiates',
	507: 'Insufficient Storage',
	508: 'Loop Detected',
	510: 'Not Extended',
	511: 'Network Authentication Required',
};

type Options = string | Partial<HttpErrorOptions>;

function merge(status: number, options?: Options | Partial<HttpErrorOptions>): HttpErrorOptions {
	if (!options || typeof options === 'string') {
		return {
			status,
			message: options || MESSAGES[status],
		};
	}

	return {
		status,
		...options,
		message: options.message || MESSAGES[status],
	};
}

export class HttpError extends ArtisanError {
	public status: number;
	public headers: Dictionary;
	public exposed: boolean;

	constructor(_options: string | HttpErrorOptions) {
		const { message, ...options }: HttpErrorOptions =
			typeof _options === 'string' ? { message: _options, status: 500 } : _options;

		super(message || '', options);

		this.headers = {};
		this.status = options.status;
		this.headers = options.headers || {};
		this.exposed = options.exposed === false ? false : true;
	}
}

export class HttpErr400 extends HttpError {
	constructor(options?: Options) {
		super(merge(400, options));
	}
}

export class HttpErr401 extends HttpError {
	constructor(options?: Options) {
		super(merge(401, options));
	}
}

export class HttpErr402 extends HttpError {
	constructor(options?: Options) {
		super(merge(402, options));
	}
}

export class HttpErr403 extends HttpError {
	constructor(options?: Options) {
		super(merge(403, options));
	}
}

export class HttpErr404 extends HttpError {
	constructor(options?: Options) {
		super(merge(404, options));
	}
}

export class HttpErr405 extends HttpError {
	constructor(options?: Options) {
		super(merge(405, options));
	}
}

export class HttpErr406 extends HttpError {
	constructor(options?: Options) {
		super(merge(406, options));
	}
}

export class HttpErr407 extends HttpError {
	constructor(options?: Options) {
		super(merge(407, options));
	}
}

export class HttpErr408 extends HttpError {
	constructor(options?: Options) {
		super(merge(408, options));
	}
}

export class HttpErr409 extends HttpError {
	constructor(options?: Options) {
		super(merge(409, options));
	}
}

export class HttpErr410 extends HttpError {
	constructor(options?: Options) {
		super(merge(410, options));
	}
}

export class HttpErr411 extends HttpError {
	constructor(options?: Options) {
		super(merge(411, options));
	}
}

export class HttpErr412 extends HttpError {
	constructor(options?: Options) {
		super(merge(412, options));
	}
}

export class HttpErr413 extends HttpError {
	constructor(options?: Options) {
		super(merge(413, options));
	}
}

export class HttpErr414 extends HttpError {
	constructor(options?: Options) {
		super(merge(414, options));
	}
}

export class HttpErr415 extends HttpError {
	constructor(options?: Options) {
		super(merge(415, options));
	}
}

export class HttpErr416 extends HttpError {
	constructor(options?: Options) {
		super(merge(416, options));
	}
}

export class HttpErr417 extends HttpError {
	constructor(options?: Options) {
		super(merge(417, options));
	}
}

export class HttpErr418 extends HttpError {
	constructor(options?: Options) {
		super(merge(418, options));
	}
}

export class HttpErr421 extends HttpError {
	constructor(options?: Options) {
		super(merge(421, options));
	}
}

export class HttpErr422 extends HttpError {
	constructor(options?: Options) {
		super(merge(422, options));
	}
}

export class HttpErr423 extends HttpError {
	constructor(options?: Options) {
		super(merge(423, options));
	}
}

export class HttpErr424 extends HttpError {
	constructor(options?: Options) {
		super(merge(424, options));
	}
}

export class HttpErr425 extends HttpError {
	constructor(options?: Options) {
		super(merge(425, options));
	}
}

export class HttpErr426 extends HttpError {
	constructor(options?: Options) {
		super(merge(426, options));
	}
}

export class HttpErr428 extends HttpError {
	constructor(options?: Options) {
		super(merge(428, options));
	}
}

export class HttpErr429 extends HttpError {
	constructor(options?: Options) {
		super(merge(429, options));
	}
}

export class HttpErr431 extends HttpError {
	constructor(options?: Options) {
		super(merge(431, options));
	}
}

export class HttpErr451 extends HttpError {
	constructor(options?: Options) {
		super(merge(451, options));
	}
}

export class HttpErr500 extends HttpError {
	constructor(options?: Options) {
		super(merge(500, options));
	}
}

export class HttpErr501 extends HttpError {
	constructor(options?: Options) {
		super(merge(501, options));
	}
}

export class HttpErr502 extends HttpError {
	constructor(options?: Options) {
		super(merge(502, options));
	}
}

export class HttpErr503 extends HttpError {
	constructor(options?: Options) {
		super(merge(503, options));
	}
}

export class HttpErr504 extends HttpError {
	constructor(options?: Options) {
		super(merge(504, options));
	}
}

export class HttpErr505 extends HttpError {
	constructor(options?: Options) {
		super(merge(505, options));
	}
}

export class HttpErr506 extends HttpError {
	constructor(options?: Options) {
		super(merge(506, options));
	}
}

export class HttpErr507 extends HttpError {
	constructor(options?: Options) {
		super(merge(507, options));
	}
}

export class HttpErr508 extends HttpError {
	constructor(options?: Options) {
		super(merge(508, options));
	}
}

export class HttpErr510 extends HttpError {
	constructor(options?: Options) {
		super(merge(510, options));
	}
}

export class HttpErr511 extends HttpError {
	constructor(options?: Options) {
		super(merge(511, options));
	}
}
