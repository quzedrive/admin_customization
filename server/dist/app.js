"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const admin_auth_routes_1 = __importDefault(require("./routes/admin-auth.routes"));
const brand_routes_1 = __importDefault(require("./routes/brand.routes"));
const package_routes_1 = __importDefault(require("./routes/package.routes"));
const upload_routes_1 = __importDefault(require("./routes/upload.routes"));
const site_settings_routes_1 = __importDefault(require("./routes/site-settings.routes"));
const email_config_routes_1 = __importDefault(require("./routes/email-config.routes"));
const image_upload_config_routes_1 = __importDefault(require("./routes/image-upload-config.routes"));
const appearance_settings_routes_1 = __importDefault(require("./routes/appearance-settings.routes"));
const car_routes_1 = __importDefault(require("./routes/car.routes"));
const system_template_routes_1 = __importDefault(require("./routes/system-template.routes"));
const cancellation_reason_routes_1 = __importDefault(require("./routes/cancellation-reason.routes"));
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: [process.env.FRONTEND_URL || 'http://localhost:3000'], // Allow Client
    credentials: true
}));
if (process.env.NODE_ENV === 'development') {
    app.use((0, morgan_1.default)('dev'));
}
app.use((0, helmet_1.default)());
// Routes
app.get('/', (req, res) => {
    res.send('API is running...');
});
app.use('/api/admin', admin_auth_routes_1.default); // /api/admin/login, /api/admin/me
app.use('/api/brands', brand_routes_1.default); // /api/brands (Public), /api/brands/admin (Admin)
app.use('/api/packages', package_routes_1.default); // /api/packages (Public), /api/packages/admin (Admin)
app.use('/api/upload', upload_routes_1.default); // /api/upload
app.use('/api/settings/email', email_config_routes_1.default);
app.use('/api/settings/image-upload', image_upload_config_routes_1.default);
app.use('/api/settings/appearance', appearance_settings_routes_1.default);
app.use('/api/templates', system_template_routes_1.default);
app.use('/api/settings/site-settings', site_settings_routes_1.default);
app.use('/api/cars', car_routes_1.default);
app.use('/api/cancellation-reasons', cancellation_reason_routes_1.default);
// Error Handling Middleware
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});
exports.default = app;
