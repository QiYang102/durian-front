class RoleIdStorage {
  private static readonly STORAGE_KEY = 'validRoleIds';

  static setRoleIds(userIds: number[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(userIds));
    } catch (error) {
      console.warn('Failed to store role IDs:', error);
    }
  }

  static getRoleIds(): number[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.warn('Failed to read role IDs:', error);
      return [];
    }
  }

  static isValidRoleId(roleId: string): boolean {
    if (roleId === "new") return true;
    
    const numericId = parseInt(roleId);
    if (isNaN(numericId) || numericId <= 0) return false;
    
    const validIds = this.getRoleIds();
    return validIds.includes(numericId);
  }

  static addRoleId(roleId: number): void {
    const currentIds = this.getRoleIds();
    if (!currentIds.includes(roleId)) {
      currentIds.push(roleId);
      this.setRoleIds(currentIds);
    }
  }

  static removeRoleId(roleId: number): void {
    const currentIds = this.getRoleIds();
    const filtered = currentIds.filter(id => id !== roleId);
    this.setRoleIds(filtered);
  }

  static clearRoleIds(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear role IDs:', error);
    }
  }
}

export default RoleIdStorage;