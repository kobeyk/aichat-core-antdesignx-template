import SnObject from "./SnObject";
import SnRole from "./SnRole";
export default class SnUser extends SnObject {
  /** name为账户信息，此处alias为用户的别名 */
  alias = '';
  /** 用户头像 */
  avatar = '';
  /** 用户角色 */
  role? : SnRole = new SnRole();
  /** 用户额外信息 */
  info?: Map<string,any>;
  /** 用户所在位置 */
  pos?:SnObject;
  cTime?:Date;
  uTime?:Date;
  constructor(options?:any) {
    super(options);
    if (options) {
      if (options.alias) this.alias = options.alias;
      if (options.avatar) this.avatar = options.avatar;
      if (options.role) this.role = new SnRole(options.role);
      /** 用户在什么位置，WHERE */
      if (options.pos) this.pos = new SnObject(options.pos);
      /** 用户信息创建和更新时间，WHEN*/
      if (options.cTime) this.cTime = new Date(options.cTime)
      if (options.uTime) this.uTime = new Date(options.uTime);
    }
  }
}