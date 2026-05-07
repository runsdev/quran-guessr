/**
 * Returns the K-factor based on the number of ranked games a player has played.
 * New players converge faster; established players are more stable.
 */
function kFactor(gamesPlayed: number): number {
  if (gamesPlayed < 30) {
    return 40;
  }
  if (gamesPlayed < 100) {
    return 32;
  }
  return 16;
}

/**
 * Computes expected score for the player given player and opponent ELO ratings.
 * Returns a value in [0, 1].
 */
function expectedScore(playerElo: number, opponentElo: number): number {
  return 1 / (1 + Math.pow(10, (opponentElo - playerElo) / 400));
}

export interface EloResult {
  newUserElo: number;
  newPageElo: number;
  userDelta: number;
  pageDelta: number;
}

/**
 * Computes new ELO ratings for both the user and the page after a quiz attempt.
 *
 * Convention: the user "plays" against the page.
 * - Correct answer → user wins (score = 1), page loses (score = 0)
 * - Wrong answer   → user loses (score = 0), page wins (score = 1)
 *
 * @param userElo - current ELO rating of the user
 * @param pageElo - current ELO rating of the page
 * @param isCorrect - whether the user answered correctly
 * @param gamesPlayed - total ranked games played by the user (controls K-factor)
 */
export function computeElo(
  userElo: number,
  pageElo: number,
  isCorrect: boolean,
  gamesPlayed: number,
): EloResult {
  const K = kFactor(gamesPlayed);
  const E = expectedScore(userElo, pageElo);
  const actualUser = isCorrect ? 1 : 0;

  const userDelta = Math.round(K * (actualUser - E));
  const pageDelta = -userDelta;

  return {
    newUserElo: Math.max(100, userElo + userDelta),
    newPageElo: Math.max(100, pageElo + pageDelta),
    userDelta,
    pageDelta,
  };
}
