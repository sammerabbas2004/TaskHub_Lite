import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { HttpError } from '../utils/httpError.js';
import { signToken } from '../utils/jwt.js';

export async function login({ email, password }) {
  const user = await User.findOne({ email }).select('+passwordHash');
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new HttpError(401, 'Invalid email or password');
  }

  return {
    token: signToken(user),
    user: { id: user._id, email: user.email, role: user.role }
  };
}
