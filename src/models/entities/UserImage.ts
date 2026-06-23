export type UserImageStatus = 'pending' | 'approved';

export interface UserImage {
  id: string;
  user_id: string;
  title?: string;
  storage_bucket: string;
  storage_path: string;
  filename: string;
  mimetype?: string;
  filesize?: number;
  status: UserImageStatus;
  created_at: string;
  moderated_by?: string;
  moderated_at?: string;
}
