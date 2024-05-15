import { Entity } from "@leanscope/ecs-engine";
import { DateAddedFacet, DueDateFacet } from "../app/a";

function sortEntitiesByTime(a?: string, b?: string) {
  return new Date(b ||0).getTime() - new Date(a||0).getTime();
}

export function sortEntitiesByDueDate(a: Entity, b: Entity) {
    const timeA = new Date(a.get(DueDateFacet)?.props.dueDate || 0).getTime();
    const timeB = new Date(b.get(DueDateFacet)?.props.dueDate || 0).getTime();

    if (timeA > timeB) {
        return 1; 
    } else if (timeA < timeB) {
        return -1
    } else {
        return 0;
    }
}

export function sortEntitiesByDateAdded(a: Entity, b: Entity) {
  return sortEntitiesByTime(a.get(DateAddedFacet)?.props.dateAdded, b.get(DateAddedFacet)?.props.dateAdded);
}