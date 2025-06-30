import { ApiService, ApiResponse } from "../ApiService";

export interface User {
  userId: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface UsersListResponse {
  message: string;
  data: User[];
}

class UserService extends ApiService {
  /**
   * Get all users (Admin only)
   * @returns List of all users
   */
  async getAllUsers(): Promise<ApiResponse<UsersListResponse>> {
    return this.get<UsersListResponse>('/user/list-all-users');
  }

  /**
   * Get user by ID
   * @param id - The user ID
   * @returns User details
   */
  async getUserById(id: number): Promise<ApiResponse<User>> {
    return this.get<User>(`/user/${id}`);
  }

  /**
   * Get user by email
   * @param email - The user email
   * @returns User details
   */
  async getUserByEmail(email: string): Promise<ApiResponse<{message: string, data: User}>> {
    return this.get<{message: string, data: User}>(`/user/email/${encodeURIComponent(email)}`);
  }

  /**
   * Delete a user
   * @param userId - The user ID to delete
   * @returns Success message
   */
  async deleteUser(userId: number): Promise<ApiResponse<{message: string}>> {
    return this.delete<{message: string}>(`/user/${userId}`);
  }

  /**
   * Demote an admin user to regular user
   * @param email - The email of the admin to demote
   * @returns Success message
   */
  async demoteAdmin(email: string): Promise<ApiResponse<{message: string}>> {
    return this.post<{message: string}>(`/user/demote/${encodeURIComponent(email)}`, {});
  }
}

export default new UserService();