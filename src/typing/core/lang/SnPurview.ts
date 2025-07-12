/** 权限类 */
export default class SnPurview {
  /**
   * 权限设置
   */
  static PURVIEW_SET = 1;

  /**
   * 信息审核
   */
  static OBJECT_CHECK = 2;
  /**
   * 超管专属权限
   * 比如：在系统域中任命管理员
   */
  static SUPER_ONLY = 4;
  /**
   * 系统用户管理（增删改）+查看系统用户
   */
  static USER_MG = 16;
  /**
   * 组织管理（增删改）+浏览组织
   */
  static GROUP_MG = 32;

  /** 权限唯一标识 */
  id = 0;

  /** 权限名称 */
  name = "";
  des?:string;
  scope?:number;

  constructor(options:any) {
    if (options) {
      if (options.id) this.id = options.id;
      if (options.name) this.name = options.name;
      /** 权限的详细描述，说明拥有权限的用户可执行的操作*/
      if (options.des) this.des = options.des;
      /** 权限的作用域，1系统，2团队，4项目 */
      if (options.scope) this.scope = options.scope;
    }
  }

  static verification = (purview: number, targetPurview: number[]): boolean => {
    // return (purview & targetPurview) === targetPurview;
    // 判断权限都满足目标权限才返回true
    return targetPurview.every((item) => (purview & item) === item);
  };
}
