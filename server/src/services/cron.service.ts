import cron from 'node-cron';
import axios from 'axios';

/**
 * Cron Service
 * 
 * Manages scheduled tasks for the application.
 * Includes a keep-alive job to prevent Render from spinning down the server.
 */
export class CronService {
    private static serverUrl = process.env.SERVER_URL || 'http://localhost:5000';

    /**
     * Start the keep-alive cron job
     * Pings the server every 12 minutes to prevent Render from spinning down
     * Only runs in production environment
     */
    static startKeepAlive(): void {
        if (process.env.NODE_ENV !== 'production') {
            console.log('[Cron] Keep-alive job disabled in development mode');
            return;
        }

        // Run every 12 minutes: '*/12 * * * *'
        // Render spins down after 15 minutes of inactivity
        cron.schedule('*/12 * * * *', async () => {
            try {
                const response = await axios.get(`${this.serverUrl}/api/health`, {
                    timeout: 10000, // 10 second timeout
                });

                console.log(`[Keep-Alive] ✓ Ping successful at ${new Date().toISOString()} - Status: ${response.data.status}`);
            } catch (error: any) {
                console.error(`[Keep-Alive] ✗ Ping failed at ${new Date().toISOString()}:`, error.message);
            }
        });

        console.log('[Cron] Keep-alive job started - Pinging every 12 minutes');
    }

    /**
     * Initialize all cron jobs
     */
    static initialize(): void {
        this.startKeepAlive();
    }
}
