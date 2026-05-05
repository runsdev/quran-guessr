export type LeaderboardTab = 'player' | 'page';

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  image: string | null;
  elo: number;
  eloChange: number;
  gamesPlayed: number;
}

export interface PageEloEntry {
  rank: number;
  pageNumber: number;
  elo: number;
  updatedAt: Date;
  juz: number;
  surah: string;
}

export interface LeaderboardStats {
  // Player ELO stats
  globalAvgPlayerElo: number;
  playerMasteryRate: string;
  currentUserElo: number | null;
  currentUserEloChange: number;
  totalPlayerEntries: number;
  // Page ELO stats
  globalAvgPageElo: number;
  hardestPageNumber: number | null;
  easiestPageNumber: number | null;
  totalPageEntries: number;
}
