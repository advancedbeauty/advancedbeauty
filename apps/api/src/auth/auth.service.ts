import axios from 'axios';
import { google } from 'googleapis';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}
  private oauth2client = new google.auth.OAuth2(
    this.configService.get('GOOGLE_CLIENT_ID'),
    this.configService.get('GOOGLE_CLIENT_SECRET'),
    'postmessage',
  );

  async googleAuth(code: string) {
    try {
      const googleRes = await this.oauth2client.getToken(code);
      this.oauth2client.setCredentials(googleRes.tokens);
      const userRes = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`,
      );
      const { email, verified_email, name, given_name, family_name, picture } =
        userRes.data;
      let user = await this.prisma.user.findUnique({
        where: { email },
      });
      if (!user) {
        user = await this.prisma.user.create({
          data: {
            email,
            email_verified: verified_email,
            name,
            given_name,
            family_name,
            picture,
          },
        });
      }
      return {
        data: user,
      };
    } catch (error) {
      return {
        error: error.message || 'An unexpected error occurred',
      };
    }
  }
}
