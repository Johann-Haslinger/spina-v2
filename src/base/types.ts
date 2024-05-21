export type BlockeditorState =  "view" | "create" | "edit" | "delete" | "write";

export type ResourceTypes = "subject" | "topic" | "note" | "flashcardSet";

export type Resource = { resourceType: ResourceTypes; id: string, title: string };
