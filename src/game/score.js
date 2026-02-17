const DEFAULT_POINTS_BY_ROW = [50, 40, 30, 20, 10];

function getPointsForRow(row, pointsByRow) {
  if (!Number.isFinite(row) || row < 0) {
    return pointsByRow[pointsByRow.length - 1];
  }

  if (row >= pointsByRow.length) {
    return pointsByRow[pointsByRow.length - 1];
  }

  return pointsByRow[row];
}

export function createScoreTracker({ pointsByRow = DEFAULT_POINTS_BY_ROW } = {}) {
  let score = 0;

  function reset() {
    score = 0;
  }

  function addInvaderHit(invader) {
    if (!invader) {
      return 0;
    }

    const points = getPointsForRow(invader.row, pointsByRow);
    score += points;
    return points;
  }

  function getScore() {
    return score;
  }

  return {
    reset,
    addInvaderHit,
    getScore,
  };
}
