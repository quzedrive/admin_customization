"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.maskSecret = exports.decrypt = exports.encrypt = void 0;
const crypto_1 = __importDefault(require("crypto"));
const ALGORITHM = 'aes-256-cbc';
const SECRET_KEY = process.env.CREDENTIALS_HASH_SECRET || 'default_secret_key_needs_to_be_32_chars_long!!'; // Must be 32 chars
// Ensure key is 32 bytes
const key = crypto_1.default.scryptSync(SECRET_KEY, 'salt', 32);
const encrypt = (text) => {
    if (!text)
        return text;
    const iv = crypto_1.default.randomBytes(16);
    const cipher = crypto_1.default.createCipheriv(ALGORITHM, key, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
};
exports.encrypt = encrypt;
const decrypt = (text) => {
    if (!text)
        return text;
    try {
        const textParts = text.split(':');
        const ivHex = textParts.shift();
        if (!ivHex)
            return text;
        const iv = Buffer.from(ivHex, 'hex');
        const encryptedText = Buffer.from(textParts.join(':'), 'hex');
        const decipher = crypto_1.default.createDecipheriv(ALGORITHM, key, iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    }
    catch (error) {
        // If decryption fails (e.g. legacy plain text), return original
        return text;
    }
};
exports.decrypt = decrypt;
const maskSecret = (text, visibleChars = 5) => {
    if (!text)
        return '';
    if (text.length <= visibleChars)
        return text;
    return text.substring(0, visibleChars) + '*'.repeat(10);
};
exports.maskSecret = maskSecret;
