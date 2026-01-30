import { chromium } from 'playwright';

export const generatePDF = async (htmlContent: string): Promise<Buffer> => {
    let browser;
    try {
        browser = await chromium.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
        });

        const page = await browser.newPage();

        // Set content and wait for network idle to ensure styles/fonts are loaded
        await page.setContent(htmlContent, {
            waitUntil: 'networkidle'
        });

        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '20px',
                right: '20px',
                bottom: '20px',
                left: '20px',
            },
        });

        return Buffer.from(pdfBuffer);
    } catch (error) {
        console.error('PDF Generation Error:', error);
        throw new Error('Failed to generate PDF');
    } finally {
        if (browser) {
            await browser.close();
        }
    }
};
