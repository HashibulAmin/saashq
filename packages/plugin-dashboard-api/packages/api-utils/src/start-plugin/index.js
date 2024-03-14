"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startPlugin = exports.app = void 0;
const dotenv = require("dotenv");
const Sentry = require("@sentry/node");
// load environment variables
dotenv.config();
const cors = require("cors");
const bodyParser = require("body-parser");
const express = require("express");
const xss_1 = require("xss");
const subgraph_1 = require("@apollo/subgraph");
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const drainHttpServer_1 = require("@apollo/server/plugin/drainHttpServer");
const cookieParser = require("cookie-parser");
const http = require("http");
const connection_1 = require("./connection");
const debuggers_1 = require("./debuggers");
const messageBroker_1 = require("@erxes/api-utils/src/messageBroker");
const logUtils_1 = require("@erxes/api-utils/src/logUtils");
const core_1 = require("@erxes/api-utils/src/core");
const internalNotes_1 = require("@erxes/api-utils/src/internalNotes");
const pubsub_1 = require("./pubsub");
const path = require("path");
const ws = require("ws");
const serviceDiscovery_1 = require("@erxes/api-utils/src/serviceDiscovery");
const { MONGO_URL, RABBITMQ_HOST, MESSAGE_BROKER_PREFIX, PORT, USE_BRAND_RESTRICTIONS, SENTRY_DSN } = process.env;
exports.app = express();
if (SENTRY_DSN) {
    Sentry.init({
        dsn: SENTRY_DSN,
        integrations: [
            // enable HTTP calls tracing
            new Sentry.Integrations.Http({ tracing: true }),
            // Automatically instrument Node.js libraries and frameworks
            ...Sentry.autoDiscoverNodePerformanceMonitoringIntegrations()
        ],
        // Set tracesSampleRate to 1.0 to capture 100%
        // of transactions for performance monitoring.
        // We recommend adjusting this value in production
        tracesSampleRate: 1.0,
        profilesSampleRate: 1.0 // Profiling sample rate is relative to tracesSampleRate
    });
}
// RequestHandler creates a separate execution context, so that all
// transactions/spans/breadcrumbs are isolated across requests
exports.app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
exports.app.use(Sentry.Handlers.tracingHandler());
exports.app.use(bodyParser.json({ limit: '15mb' }));
exports.app.use(bodyParser.urlencoded({ limit: '15mb', extended: true }));
async function startPlugin(configs) {
    (0, debuggers_1.initDebuggers)(configs);
    if (configs.middlewares) {
        for (const middleware of configs.middlewares) {
            exports.app.use(middleware);
        }
    }
    if (configs.postHandlers) {
        for (const handler of configs.postHandlers) {
            if (handler.path && handler.method) {
                exports.app.post(handler.path, handler.method);
            }
        }
    }
    if (configs.getHandlers) {
        for (const handler of configs.getHandlers) {
            if (handler.path && handler.method) {
                exports.app.get(handler.path, handler.method);
            }
        }
    }
    exports.app.disable('x-powered-by');
    exports.app.use(cors(configs.corsOptions || {}));
    exports.app.use(cookieParser());
    // for health checking
    exports.app.get('/health', async (_req, res) => {
        res.end('ok');
    });
    if (configs.hasSubscriptions) {
        exports.app.get('/subscriptionPlugin.js', async (req, res) => {
            res.sendFile(path.join(configs.subscriptionPluginPath));
        });
    }
    if (configs.hasDashboard) {
        if (configs.hasDashboard) {
            exports.app.get('/dashboard', async (req, res) => {
                const headers = req.rawHeaders;
                const index = headers.indexOf('schemaName') + 1;
                const schemaName = headers[index];
                res.sendFile(path.join(__dirname, `../../src/dashboardSchemas/${schemaName}.js`));
            });
        }
    }
    exports.app.use((req, _res, next) => {
        req.rawBody = '';
        req.on('data', chunk => {
            req.rawBody += chunk.toString();
        });
        next();
    });
    // Error handling middleware
    exports.app.use((error, _req, res, _next) => {
        const msg = (0, xss_1.filterXSS)(error.message);
        (0, debuggers_1.debugError)(`Error: ${msg}`);
        res.status(500).send(msg);
    });
    // The error handler must be before any other error middleware and after all controllers
    exports.app.use(Sentry.Handlers.errorHandler());
    const httpServer = http.createServer(exports.app);
    // GRACEFULL SHUTDOWN
    process.stdin.resume(); // so the program will not close instantly
    async function closeHttpServer() {
        try {
            await new Promise((resolve, reject) => {
                // Stops the server from accepting new connections and finishes existing connections.
                httpServer.close((error) => {
                    if (error) {
                        return reject(error);
                    }
                    resolve();
                });
            });
        }
        catch (e) {
            console.error(e);
        }
    }
    async function leaveServiceDiscovery() {
        try {
            await (0, serviceDiscovery_1.leave)(configs.name, PORT || '');
            console.log(`Left service discovery. name=${configs.name} port=${PORT}`);
        }
        catch (e) {
            console.error(e);
        }
    }
    // If the Node process ends, close the Mongoose connection
    ['SIGINT', 'SIGTERM'].forEach(sig => {
        process.on(sig, async () => {
            await closeHttpServer();
            await leaveServiceDiscovery();
            process.exit(0);
        });
    });
    const generateApolloServer = async (serviceDiscovery) => {
        const services = await (0, serviceDiscovery_1.getServices)();
        (0, debuggers_1.debugInfo)(`Enabled services .... ${JSON.stringify(services)}`);
        const { typeDefs, resolvers } = await configs.graphql(serviceDiscovery);
        return new server_1.ApolloServer({
            schema: (0, subgraph_1.buildSubgraphSchema)([
                {
                    typeDefs,
                    resolvers
                }
            ]),
            // for graceful shutdown
            plugins: [(0, drainHttpServer_1.ApolloServerPluginDrainHttpServer)({ httpServer })]
        });
    };
    const serviceDiscovery = {
        getServices: serviceDiscovery_1.getServices,
        getService: serviceDiscovery_1.getService,
        isAvailable: serviceDiscovery_1.isAvailable,
        isEnabled: serviceDiscovery_1.isEnabled
    };
    const apolloServer = await generateApolloServer(serviceDiscovery);
    await apolloServer.start();
    exports.app.use('/graphql', (0, express4_1.expressMiddleware)(apolloServer, {
        context: async ({ req, res }) => {
            let user = null;
            if (req.headers.user) {
                if (Array.isArray(req.headers.user)) {
                    throw new Error(`Multiple user headers`);
                }
                const userJson = Buffer.from(req.headers.user, 'base64').toString('utf-8');
                user = JSON.parse(userJson);
            }
            let context;
            if (USE_BRAND_RESTRICTIONS !== 'true') {
                context = {
                    brandIdSelector: {},
                    singleBrandIdSelector: {},
                    userBrandIdsSelector: {},
                    docModifier: doc => doc,
                    commonQuerySelector: {},
                    user,
                    res
                };
            }
            else {
                let scopeBrandIds = JSON.parse(req.cookies.scopeBrandIds || '[]');
                let brandIds = [];
                let brandIdSelector = {};
                let commonQuerySelector = {};
                let commonQuerySelectorElk;
                let userBrandIdsSelector = {};
                let singleBrandIdSelector = {};
                if (user) {
                    brandIds = user.brandIds || [];
                    if (scopeBrandIds.length === 0) {
                        scopeBrandIds = brandIds;
                    }
                    if (!user.isOwner && scopeBrandIds.length > 0) {
                        brandIdSelector = { _id: { $in: scopeBrandIds } };
                        commonQuerySelector = { scopeBrandIds: { $in: scopeBrandIds } };
                        commonQuerySelectorElk = { terms: { scopeBrandIds } };
                        userBrandIdsSelector = { brandIds: { $in: scopeBrandIds } };
                        singleBrandIdSelector = { brandId: { $in: scopeBrandIds } };
                    }
                }
                context = {
                    brandIdSelector,
                    singleBrandIdSelector,
                    docModifier: doc => ({ ...doc, scopeBrandIds }),
                    commonQuerySelector,
                    commonQuerySelectorElk,
                    userBrandIdsSelector,
                    user,
                    res
                };
            }
            await configs.apolloServerContext(context, req, res);
            return context;
        }
    }));
    await new Promise(resolve => httpServer.listen({ port: PORT }, resolve));
    if (configs.freeSubscriptions) {
        const wsServer = new ws.Server({
            server: httpServer,
            path: '/subscriptions'
        });
        await configs.freeSubscriptions(wsServer);
    }
    console.log(`🚀 ${configs.name} graphql api ready at http://localhost:${PORT}/graphql`);
    const mongoUrl = MONGO_URL || '';
    // connect to mongo database
    const db = await (0, connection_1.connect)(mongoUrl);
    const messageBrokerClient = await (0, messageBroker_1.init)({
        RABBITMQ_HOST,
        MESSAGE_BROKER_PREFIX,
        redis: serviceDiscovery_1.redis,
        app: exports.app
    }, configs.reconnectRMQ);
    if (configs.permissions) {
        await messageBrokerClient.sendMessage('registerPermissions', configs.permissions);
    }
    if (configs.meta) {
        const { segments, forms, tags, imports, internalNotes, automations, search, webhooks, initialSetup, cronjobs, documents, exporter, documentPrintHook, readFileHook, payment, reports } = configs.meta;
        const { consumeRPCQueue, consumeQueue } = messageBrokerClient;
        const logs = configs.meta.logs && configs.meta.logs.consumers;
        if (segments) {
            if (segments.propertyConditionExtender) {
                segments.propertyConditionExtenderAvailable = true;
                consumeRPCQueue(`${configs.name}:segments.propertyConditionExtender`, segments.propertyConditionExtender);
            }
            if (segments.associationFilter) {
                segments.associationFilterAvailable = true;
                consumeRPCQueue(`${configs.name}:segments.associationFilter`, segments.associationFilter);
            }
            if (segments.esTypesMap) {
                segments.esTypesMapAvailable = true;
                consumeRPCQueue(`${configs.name}:segments.esTypesMap`, segments.esTypesMap);
            }
            if (segments.initialSelector) {
                segments.initialSelectorAvailable = true;
                consumeRPCQueue(`${configs.name}:segments.initialSelector`, segments.initialSelector);
            }
        }
        if (logs) {
            (0, logUtils_1.logConsumers)({
                name: configs.name,
                consumeRPCQueue,
                getActivityContent: logs.getActivityContent,
                getContentTypeDetail: logs.getContentTypeDetail,
                collectItems: logs.collectItems,
                getContentIds: logs.getContentIds,
                getSchemalabels: logs.getSchemaLabels
            });
        }
        if (forms) {
            if (forms.fields) {
                consumeRPCQueue(`${configs.name}:fields.getList`, async (args) => ({
                    status: 'success',
                    data: await forms.fields(args)
                }));
            }
            if (forms.groupsFilter) {
                consumeRPCQueue(`${configs.name}:fields.groupsFilter`, async (args) => ({
                    status: 'success',
                    data: await forms.groupsFilter(args)
                }));
            }
            if (forms.systemFields) {
                forms.systemFieldsAvailable = true;
                consumeRPCQueue(`${configs.name}:systemFields`, async (args) => ({
                    status: 'success',
                    data: await forms.systemFields(args)
                }));
            }
            if (forms.fieldsGroupsHook) {
                forms.groupsHookAvailable = true;
                consumeRPCQueue(`${configs.name}:fieldsGroupsHook`, async (args) => ({
                    status: 'success',
                    data: await forms.fieldsGroupsHook(args)
                }));
            }
            if (forms.relations) {
                forms.relationsAvailable = true;
                consumeRPCQueue(`${configs.name}:relations`, async (args) => ({
                    status: 'success',
                    data: await forms.relations(args)
                }));
            }
        }
        if (tags) {
            if (tags.tag) {
                consumeRPCQueue(`${configs.name}:tag`, async (args) => ({
                    status: 'success',
                    data: await tags.tag(args)
                }));
            }
            if (tags.publishChange) {
                tags.publishChangeAvailable = true;
                consumeRPCQueue(`${configs.name}:publishChange`, async (args) => ({
                    status: 'success',
                    data: await tags.publishChange(args)
                }));
            }
            if (tags.fixRelatedItems) {
                consumeRPCQueue(`${configs.name}:fixRelatedItems`, async (args) => ({
                    status: 'success',
                    data: await tags.fixRelatedItems(args)
                }));
            }
        }
        if (webhooks) {
            if (webhooks.getInfo) {
                webhooks.getInfoAvailable = true;
                consumeRPCQueue(`${configs.name}:webhooks.getInfo`, async (args) => ({
                    status: 'success',
                    data: await webhooks.getInfo(args)
                }));
            }
        }
        if (internalNotes) {
            (0, internalNotes_1.internalNoteConsumers)({
                name: configs.name,
                consumeRPCQueue,
                generateInternalNoteNotif: internalNotes.generateInternalNoteNotif
            });
        }
        if (imports) {
            if (imports.prepareImportDocs) {
                consumeRPCQueue(`${configs.name}:imports.prepareImportDocs`, async (args) => ({
                    status: 'success',
                    data: await imports.prepareImportDocs(args)
                }));
            }
            if (imports.insertImportItems) {
                consumeRPCQueue(`${configs.name}:imports.insertImportItems`, async (args) => ({
                    status: 'success',
                    data: await imports.insertImportItems(args)
                }));
            }
        }
        if (exporter) {
            if (exporter.prepareExportData) {
                consumeRPCQueue(`${configs.name}:exporter.prepareExportData`, async (args) => ({
                    status: 'success',
                    data: await exporter.prepareExportData(args)
                }));
            }
            if (exporter.getExportDocs) {
                consumeRPCQueue(`${configs.name}:exporter.getExportDocs`, async (args) => ({
                    status: 'success',
                    data: await exporter.getExportDocs(args)
                }));
            }
        }
        if (automations) {
            if (automations.receiveActions) {
                consumeRPCQueue(`${configs.name}:automations.receiveActions`, async (args) => ({
                    status: 'success',
                    data: await automations.receiveActions(args)
                }));
            }
            if (automations === null || automations === void 0 ? void 0 : automations.getRecipientsEmails) {
                consumeRPCQueue(`${configs.name}:automations.getRecipientsEmails`, async (args) => ({
                    status: 'success',
                    data: await automations.getRecipientsEmails(args)
                }));
            }
            if (automations === null || automations === void 0 ? void 0 : automations.replacePlaceHolders) {
                consumeRPCQueue(`${configs.name}:automations.replacePlaceHolders`, async (args) => ({
                    status: 'success',
                    data: await automations.replacePlaceHolders(args)
                }));
            }
        }
        if (reports) {
            if (reports.getChartResult) {
                consumeRPCQueue(`${configs.name}:reports.getChartResult`, async (args) => ({
                    status: 'success',
                    data: await reports.getChartResult(args)
                }));
            }
        }
        if (initialSetup) {
            if (initialSetup.generate) {
                initialSetup.generateAvailable = true;
                consumeQueue(`${configs.name}:initialSetup`, async (args) => ({
                    status: 'success',
                    data: await initialSetup.generate(args)
                }));
                exports.app.post('/initial-setup', async (req, res) => {
                    await initialSetup.generate({ subdomain: (0, core_1.getSubdomain)(req) });
                    return res.end('ok');
                });
            }
        }
        if (search) {
            configs.meta.isSearchable = true;
            consumeRPCQueue(`${configs.name}:search`, async (args) => ({
                status: 'success',
                data: await search(args)
            }));
        }
        if (cronjobs) {
            if (cronjobs.handleMinutelyJob) {
                cronjobs.handleMinutelyJobAvailable = true;
                consumeQueue(`${configs.name}:handleMinutelyJob`, async (args) => ({
                    status: 'success',
                    data: await cronjobs.handleMinutelyJob(args)
                }));
            }
            if (cronjobs.handle10MinutelyJob) {
                cronjobs.handle10MinutelyJobAvailable = true;
                consumeQueue(`${configs.name}:handle10MinutelyJob`, async (args) => ({
                    status: 'success',
                    data: await cronjobs.handle10MinutelyJob(args)
                }));
            }
            if (cronjobs.handleHourlyJob) {
                cronjobs.handleHourlyJobAvailable = true;
                consumeQueue(`${configs.name}:handleHourlyJob`, async (args) => ({
                    status: 'success',
                    data: await cronjobs.handleHourlyJob(args)
                }));
            }
            if (cronjobs.handleDailyJob) {
                cronjobs.handleDailyJobAvailable = true;
                consumeQueue(`${configs.name}:handleDailyJob`, async (args) => ({
                    status: 'success',
                    data: await cronjobs.handleDailyJob(args)
                }));
            }
        }
        if (documents) {
            consumeRPCQueue(`${configs.name}:documents.editorAttributes`, async (args) => ({
                status: 'success',
                data: await documents.editorAttributes(args)
            }));
            consumeRPCQueue(`${configs.name}:documents.replaceContent`, async (args) => ({
                status: 'success',
                data: await documents.replaceContent(args)
            }));
        }
        if (readFileHook) {
            readFileHook.isAvailable = true;
            consumeRPCQueue(`${configs.name}:readFileHook`, async (args) => ({
                status: 'success',
                data: await readFileHook.action(args)
            }));
        }
        if (documentPrintHook) {
            documentPrintHook.isAvailable = true;
            consumeRPCQueue(`${configs.name}:documentPrintHook`, async (args) => ({
                status: 'success',
                data: await documentPrintHook.action(args)
            }));
        }
        if (payment) {
            if (payment.callback) {
                payment.callbackAvailable = true;
                consumeQueue(`${configs.name}:paymentCallback`, async (args) => ({
                    status: 'success',
                    data: await payment.callback(args)
                }));
            }
        }
    } // end configs.meta if
    await (0, serviceDiscovery_1.join)({
        name: configs.name,
        port: PORT || '',
        dbConnectionString: mongoUrl,
        hasSubscriptions: configs.hasSubscriptions,
        hasDashboard: configs.hasDashboard,
        importExportTypes: configs.importExportTypes,
        meta: configs.meta
    });
    configs.onServerInit({
        db,
        app: exports.app,
        redis: serviceDiscovery_1.redis,
        pubsubClient: pubsub_1.default,
        messageBrokerClient,
        debug: {
            info: debuggers_1.debugInfo,
            error: debuggers_1.debugError
        }
    });
    (0, debuggers_1.debugInfo)(`${configs.name} server is running on port: ${PORT}`);
    return exports.app;
}
exports.startPlugin = startPlugin;
exports.default = startPlugin;
