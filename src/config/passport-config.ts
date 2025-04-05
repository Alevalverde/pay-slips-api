import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import jwt from 'jsonwebtoken';

// Interfaz para el payload del token
interface JwtPayload {
  id: string;
  username: string;
}

// Clave secreta para firmar y verificar tokens
const SECRET_KEY = 'tu_clave_secreta'; // Cambia esto por una clave segura

// Opciones para la estrategia JWT
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extrae el token del header "Authorization"
  secretOrKey: SECRET_KEY,
};

// Estrategia de Passport para JWT
passport.use(
  new JwtStrategy(jwtOptions, async (payload: JwtPayload, done) => {
    try {
      // Aquí puedes buscar el usuario en la base de datos usando el `payload.id`
      const user = { id: payload.id, username: payload.username }; // Simulación de usuario
      if (user) {
        return done(null, user);
      }
      return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  })
);

// Función para generar un token JWT
export const generateToken = (user: { id: string; username: string }): string =>
  jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, {
    expiresIn: '1h', // El token expira en 1 hora
  });

// Middleware para proteger rutas
export const authenticateJwt = passport.authenticate('jwt', { session: false });
