import type { Observable } from 'rxjs';
import type { VerifyUserTokenResponse } from './authorizer-response.dto';

export type VerifyUserTokenRequest = {
  token: string;
  processId: string;
};

export interface AuthorizerService {
  verifyUserToken(params: VerifyUserTokenRequest): Observable<VerifyUserTokenResponse>;
}
