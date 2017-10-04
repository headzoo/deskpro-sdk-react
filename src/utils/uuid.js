let UUIDCounter = 0;

/**
 * @returns {number}
 */
export function nextUUID() {
  UUIDCounter += 1;
  return UUIDCounter;
}
