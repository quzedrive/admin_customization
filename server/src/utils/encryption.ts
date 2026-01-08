import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const SECRET_KEY = (process.env.CREDENTIALS_HASH_SECRET || 'default_secret_key_needs_to_be_32_chars_long!!').trim(); // Must be 32 chars
// Ensure key is 32 bytes
const key = crypto.scryptSync(SECRET_KEY, 'salt', 32);

export const encrypt = (text: string): string => {
    if (!text) return text;
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
};

export const decrypt = (text: string): string => {
    if (!text) return text;
    try {
        const textParts = text.split(':');
        const ivHex = textParts.shift();
        if (!ivHex) return text;
        const iv = Buffer.from(ivHex, 'hex');
        const encryptedText = Buffer.from(textParts.join(':'), 'hex');
        const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    } catch (error) {
        // If decryption fails (e.g. legacy plain text), return original
        return text;
    }
};

export const maskSecret = (text: string, visibleChars = 5): string => {
    if (!text) return '';
    if (text.length <= visibleChars) return text;
    return text.substring(0, visibleChars) + '*'.repeat(10);
};
