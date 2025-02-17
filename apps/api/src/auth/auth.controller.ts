import {
  Controller,
  Body,
  Get,
  Post,
  HttpCode,
  Req,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  async googleAuth(@Req() req: any) {
    const response = await this.authService.googleAuth(req.query.code);
    if (response.error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Failed to retrieve user information',
        error: response.error,
      };
    }
    return {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'User information retrieved successfully',
      data: response.data,
    };
  }
}
