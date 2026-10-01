import { verifyToken } from '../utils/jwt.js';
import { User } from '../models/User.js';
import { HttpError } from '../utils/httpError.js';

export async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) throw new HttpError(401, 'Authentication required');

    const payload = verifyToken(header.slice(7));
    const user = await User.findById(payload.sub).select('_id email role');
    if (!user) throw new HttpError(401, 'User no longer exists');

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return next(new HttpError(401, 'Invalid or expired token'));
    }
    next(error);
  }
}
