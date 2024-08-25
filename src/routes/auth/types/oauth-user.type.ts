export interface OAuthUser {
  username: string;
  nickname: string;
  profileImageUrl?: string;
  accessToken: string;
  refreshToken: string;
}
