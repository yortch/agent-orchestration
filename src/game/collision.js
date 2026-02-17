export function isAabbCollision(entityA, entityB) {
  if (!entityA?.active || !entityB?.active) {
    return false;
  }

  return (
    entityA.x < entityB.x + entityB.width &&
    entityA.x + entityA.width > entityB.x &&
    entityA.y < entityB.y + entityB.height &&
    entityA.y + entityA.height > entityB.y
  );
}

export function runOnCollision(entityA, entityB, onCollision) {
  if (!isAabbCollision(entityA, entityB)) {
    return false;
  }

  if (typeof onCollision === "function") {
    onCollision();
  }

  return true;
}
