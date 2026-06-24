import { Project } from "./project";
import { Story } from "./story";
import { Team } from "./team";

export interface StoryTag {
  id: number;
  name: string;
  color: string;
  project: Project;
  team: Team;
}

export interface StoryTagItem {
  id: number;
  tag: number;
  story_id: number;
}

export interface TagReport {
  total_stories: number;
  total_estimate_hours: number;
  tag_item: StoryTagItem;
  stories: Story[];
}
