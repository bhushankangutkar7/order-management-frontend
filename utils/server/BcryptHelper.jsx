import 'server-only';
import bcrypt from 'bcryptjs';

export async function hashPassword(password) {
    const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS));
    return await bcrypt.hash(password, salt);
}

export async function comparePassword(password, hash) {
    return await bcrypt.compare(password, hash);
}