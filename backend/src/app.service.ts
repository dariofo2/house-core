import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return '<h1>Welcome to House Core Service!!!</h1> <h2>If Dev, go to /api to check endpoints</h2><h3>If Prod, u can still Go to /api/public to check public endpoints (instead of using JWTToken HTTPONLY Cookie, it uses authorization Header to use JWT and connect this API with other Apps)</h3>';
  }
}
