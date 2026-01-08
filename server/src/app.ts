import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

import adminAuthRoutes from './routes/admin-auth.routes';
import adminProfileRoutes from './routes/admin-profile.routes';
import brandRoutes from './routes/brand.routes';
import packageRoutes from './routes/package.routes';
import uploadRoutes from './routes/upload.routes';
import siteSettingsRoutes from './routes/site-settings.routes';
import emailConfigRoutes from './routes/email-config.routes';
import imageUploadConfigRoutes from './routes/image-upload-config.routes';
import appearanceConfigRoutes from './routes/appearance-settings.routes';
import carRoutes from './routes/car.routes';
import systemTemplateRoutes from './routes/system-template.routes';
import cancellationReasonRoutes from './routes/cancellation-reason.routes';

const app: Application = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: [process.env.FRONTEND_URL || 'http://localhost:3000'], // Allow Client
    credentials: true
}));

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
app.use(helmet());

// Routes
app.get('/', (req: Request, res: Response) => {
    res.send('API is running...');
});

// Health check endpoint for monitoring and keep-alive
app.get('/api/health', (req: Request, res: Response) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
    });
});

// API Routes
app.use('/api/admin', adminAuthRoutes);
app.use('/api/admin/profile', adminProfileRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/settings/site-settings', siteSettingsRoutes);
app.use('/api/settings/email', emailConfigRoutes);
app.use('/api/settings/image-upload', imageUploadConfigRoutes);
app.use('/api/settings/appearance', appearanceConfigRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/system-templates', systemTemplateRoutes);
app.use('/api/cancellation-reasons', cancellationReasonRoutes);

// Error Handling Middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

export default app;
