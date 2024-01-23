export interface Todo {
  id: number;
  summary: string;
  description?: string;
  completeByDate: Date;
  isCompleted: boolean;
  priority: number;
}
