export type ReminderUnit = "minutes" | "hours" | "days";

export type NotificationChannel = "site" | "sound" | "email" | "whatsapp";

export type Mood =
  | "feliz"
  | "calmo"
  | "neutro"
  | "ansioso"
  | "triste"
  | "irritado"
  | "grato"
  | "animado";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type ProfileRow = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  theme: string;
  notify_email: boolean;
  notify_whatsapp: boolean;
  notify_sound: boolean;
  whatsapp_number: string | null;
  contact_email: string | null;
  created_at: string;
  updated_at: string;
};

type DiaryRow = {
  id: string;
  user_id: string;
  entry_date: string;
  title: string | null;
  content: string;
  mood: Mood | null;
  tags: string[];
  created_at: string;
  updated_at: string;
};

type EventRow = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  location: string | null;
  color: string;
  starts_at: string;
  ends_at: string | null;
  all_day: boolean;
  created_at: string;
  updated_at: string;
};

type ReminderRow = {
  id: string;
  event_id: string;
  user_id: string;
  unit: ReminderUnit;
  value: number;
  channels: NotificationChannel[];
  dismissed_at: string | null;
  last_fired_at: string | null;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow;
        Insert: Partial<ProfileRow> & { id: string };
        Update: Partial<ProfileRow>;
        Relationships: [];
      };
      diary_entries: {
        Row: DiaryRow;
        Insert: Omit<DiaryRow, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<DiaryRow>;
        Relationships: [];
      };
      events: {
        Row: EventRow;
        Insert: Omit<EventRow, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<EventRow>;
        Relationships: [];
      };
      event_reminders: {
        Row: ReminderRow;
        Insert: Omit<
          ReminderRow,
          "id" | "created_at" | "dismissed_at" | "last_fired_at"
        > & {
          id?: string;
          created_at?: string;
          dismissed_at?: string | null;
          last_fired_at?: string | null;
        };
        Update: Partial<ReminderRow>;
        Relationships: [
          {
            foreignKeyName: "event_reminders_event_id_fkey";
            columns: ["event_id"];
            isOneToOne: false;
            referencedRelation: "events";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
