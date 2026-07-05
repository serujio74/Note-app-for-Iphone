export type Category = {
  id: number;
  name: string;
  color: string;
};

export type Note = {
  id: number;
  title: string;
  body: string;
  categoryId: number;
  date: string | null; // "YYYY-MM-DD"
  reminderDatetime: string | null; // ISO datetime
  reminderNotificationId: string | null;
  createdAt: string;
  updatedAt: string;
};
