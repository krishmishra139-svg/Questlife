export type Attribute = "strength" | "intellect" | "spirit";
export type Difficulty = "easy" | "medium" | "hard";

export interface ProfileRow {
  id: string;
  level: number;
  xp: number;
  gold: number;
  strength: number;
  intellect: number;
  spirit: number;
  streak: number;
  last_completed_date: string | null; // "YYYY-MM-DD"
  created_at: string;
}

export interface QuestRow {
  id: string;
  user_id: string;
  title: string;
  description: string;
  attribute: Attribute;
  difficulty: Difficulty;
  xp: number;
  gold: number;
  completed: boolean;
  created_at: string;
}

// Minimal Database shape so the Supabase client is typed end-to-end.
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow;
        Insert: Partial<ProfileRow> & { id: string };
        Update: Partial<ProfileRow>;
      };
      quests: {
        Row: QuestRow;
        Insert: Partial<QuestRow> & {
          user_id: string;
          title: string;
          attribute: Attribute;
          difficulty: Difficulty;
          xp: number;
          gold: number;
        };
        Update: Partial<QuestRow>;
      };
    };
  };
}
