import { ReactNode } from "react";

export type BlockeditorState = "view" | "create" | "edit" | "delete" | "write";

export type ResourceTypes = "subject" | "topic" | "note" | "flashcardSet";

export interface Resource {
  resourceType: ResourceTypes;
  id: string;
  title: string;
}

export interface CardData {
  title: string;
  description: string;
  backgroundColor: string;
  color: string;
  buttonText: string;
  icon: ReactNode;
}
