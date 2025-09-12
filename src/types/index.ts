export type User = {
  id: number;
  username: string;
  created_at: string;
};

export type ItemRow = {
  id: number;
  user_id: number;
  kind: 'note' | 'task' | 'todo';
  data: any; // JSON field
  updated_at: string;
  deleted: 0 | 1;
};
