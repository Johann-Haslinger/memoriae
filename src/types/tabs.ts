import type { LucideIcon } from "lucide-react";

export type TabType = "notes" | "flashcards" | "quizzes" | "content";

export interface Tab {
  id: TabType;
  label: string;
  show: boolean;
  icon: LucideIcon;
  iconColor: string;
}
