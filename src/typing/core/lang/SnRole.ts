export default class SnRole {
  // 管理员
  static DEFAULT_MANAGER_ROLE = 2;
  // 系统用户
  static DEFAULT_USER_ROLE = 3;

  /** 角色标识 */
  rid = 0;

  /** 角色的名称 */
  name = '';

  /** 这里的权限总值是用户的权限总值而不仅仅是角色对应的默认权限总值 */
  purview = 0;

  constructor(options?:any) {
    if (options) {
      if (options.rid) this.rid = options.rid;
      if (options.name) this.name = options.name;
      if (options.purview) this.purview = options.purview;
    }
  }

  /**
   * 权限逻辑或操作，计算最终权限值(合并权限值,用于计算权限与某个权限的合并后总值)
   * @param {long} purview 
   */
  orPurview(purview:number) {
    this.purview = this.purview | purview;
  }

  /**
   * 判断是否具有目标权限
   * @param {long} targetPurview 
   */
  hasPurview(targetPurview:number) {
    return (this.purview & targetPurview) === targetPurview;
  }
}