import type { Response } from '../common/response.interface';
import type { User } from '@common/schemas/user.schema';
import type { Observable } from 'rxjs';

export interface UserById {
  userId: string;
  processId: string;
}

export interface UserAccessService {
  getUserByUserId(data: UserById): Observable<Response<User>>;
}
