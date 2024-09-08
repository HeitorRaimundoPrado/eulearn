import User from './User';

enum Theme {
  DRK = "dark",
  LHT = "light",
}

enum Language {
  "PT-BR" = "Português (Brasil)",
  "EN-US" = "English (US)"
}

export default interface Settings {
  emailNotifications: boolean;
  dmNotifications: boolean;
  forumAnswersNotifications: boolean;
  privateCommunityActivityNotifications: boolean;
  blockedUsers: User[];
  theme: Theme;
  fontSize: number;
  language: Language;
}
