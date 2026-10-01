import { loginSchema } from '../validators/auth.js';
import { login } from '../services/authService.js';

export async function loginController(req, res) {
  const data = loginSchema.parse(req.body);
  res.json(await login(data));
}
