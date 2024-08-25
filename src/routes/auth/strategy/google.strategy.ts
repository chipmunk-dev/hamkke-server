import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly configService: ConfigService) {
    const protocol = configService.get('PROTOCOL');
    const host = configService.get('HOST');
    const port = configService.get('PORT');
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_SECRET'),
      callbackURL: `${protocol}://${host}:${port}/auth/google/callback`,
      scope: ['email', 'profile'],
      accessType: 'offline',
      prompt: 'consent',
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    const { displayName, emails, photos } = profile;
    const user = {
      username: emails[0].value,
      nickname: displayName,
      profileImageUrl: photos[0].value,
      accessToken,
      refreshToken,
    };

    return user;
  }
}
