export type RoleCategory = 'tank' | 'warrior' | 'assassin' | 'marksman' | 'mage' | 'support';

export interface SubClassCriterion {
  id: string;
  name: string;
  parentRole: RoleCategory;
  criterion: string;
  matchedCharacterIds?: string[];
}

export interface CharacterSubClassMatch {
  name: string;
  parentRole: RoleCategory;
  criterion: string;
  rationale: string;
}

export interface RoleInfo {
  id: RoleCategory;
  name: string;
  englishName: string;
  themeColor: string;
  bgColor: string;
  borderColor: string;
  description: string;
  subClasses: SubClassCriterion[];
}
