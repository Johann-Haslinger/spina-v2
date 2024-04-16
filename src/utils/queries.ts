import { Entity } from "@leanscope/ecs-engine";
import { DataTypes } from "../base/enums";

export const dataTypeQuery = (e: Entity, dataType: DataTypes): boolean  => e.hasTag(dataType);