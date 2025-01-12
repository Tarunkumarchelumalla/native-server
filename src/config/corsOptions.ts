const whiteList = [
    'http://localhost:3002'
];

// Enable CORS for a specific domain
const baseCorsOptions = {
    origin: function (origin, callback) {
        console.log("CORS: origin check");
        if (whiteList.indexOf(origin) !== -1 || !origin) {
            console.log("CORS: origin approved");
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    methods: ['GET', 'PUT', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization', 'api-key'],
    credentials: true, // Enable credentials
};

// Middleware to set CORS headers for all routes
const customeCorsMiddleware = (req, res, next) => {
    console.log("CORS: Middleware invoked...");
    const origin = req.headers.origin;
    console.log("CORS: Request received from:", origin);

    if (!origin || whiteList.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin || "*");
    }

    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT');
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization, Access-Control-Allow-Origin, api-key");

    if (req.method === 'OPTIONS') {
        res.sendStatus(204);
    } else {
        next();
    }
};

// Merge the base CORS options with the custom middleware
const customCorsOptions = {
    ...baseCorsOptions,
    preflightContinue: true, // Ensure that preflight requests go through the middleware
    optionsSuccessStatus: 204, // Set the status for successful OPTIONS requests
    maxAge: 86400, // Set the max age for CORS preflight requests (in seconds)
};

export { customCorsOptions, customeCorsMiddleware };
