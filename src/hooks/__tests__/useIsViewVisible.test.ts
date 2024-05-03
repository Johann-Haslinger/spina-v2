import { Entity } from "@leanscope/ecs-engine";
import { Tags } from "@leanscope/ecs-models";
import { useIsViewVisible } from "../useIsViewVisible";
import { AdditionalTags } from "../../base/enums";

test("testing useIsViewVisible hook", () => {
  const newEntity = new Entity();
  newEntity.addTag(Tags.SELECTED);

  const newEntity2 = new Entity();
  newEntity2.addTag(Tags.SELECTED);
  newEntity2.addTag(AdditionalTags.NAVIGATE_BACK);

  expect(newEntity.hasTag(Tags.SELECTED)).toBe(true);
  expect(newEntity2.hasTag(Tags.SELECTED)).toBe(true);
  expect(newEntity2.hasTag(AdditionalTags.NAVIGATE_BACK)).toBe(true);

  expect(useIsViewVisible(newEntity)).toBe(true);
  expect(useIsViewVisible(newEntity2)).toBe(false);
});
