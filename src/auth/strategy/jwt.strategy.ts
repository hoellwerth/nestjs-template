import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as dotenv from 'dotenv';

dotenv.config({
  path: 'src/modules/environment/config/dev.env',
});

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(secret: string) {
    super({
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret || process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    return {
      id: payload.sub,
      username: payload.name,
      email: payload.email,
    };
  }
}
