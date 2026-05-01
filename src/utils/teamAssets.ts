export type TeamId = string;

export type TeamColors = {
  primary: string;
  secondary: string;
  glow: string;
};

export type TeamVisualStyle = TeamColors & {
  background: string;
  borderColor: string;
  boxShadow: string;
};

export { getTeamLogo, getTeamColors, getTeamVisualStyle } from './teamAssets.js';