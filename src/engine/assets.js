export function createAssetManager() {
  return {
    async preload() {
      return Promise.resolve();
    },
    get loaded() {
      return true;
    },
  };
}
