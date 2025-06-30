import { ApiResponse } from "../..";
import { ApiService } from "../ApiService";

interface PromoteUserResponse {
  message: string;
}

class SetupService extends ApiService {
  async promoteUserToAdmin(email: string): Promise<ApiResponse<PromoteUserResponse>> {
    return this.post<PromoteUserResponse>(`/setup/${encodeURIComponent(email)}`, {});
  }
}

export default new SetupService();