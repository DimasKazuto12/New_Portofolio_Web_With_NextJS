import crypto from 'crypto';

const SALT = process.env.ADMIN_SALT || "trailblaze-salt";

export function hashPassword(password: string) {
    return crypto.createHash("sha256").update(password + SALT).digest("hex");
}

export function isAuthorized(cookieValue?: string | null) {
    if (!cookieValue || !process.env.ADMIN_PASSWORD) return false;
    return cookieValue === hashPassword(process.env.ADMIN_PASSWORD);
}