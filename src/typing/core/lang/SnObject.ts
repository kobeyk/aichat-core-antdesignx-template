export default class SnObject {
  /** 对象的唯一标识*/
  id?: number = -1;

  /**对象名称 */
  name?: string = "";

  /**
   * @param {Object} options
   * @param {bool} bclone 是否拷贝全部属性
   */
  constructor(options?: any, bclone?: boolean) {
    if (options) {
      if (options.id >= 0) this.id = options.id;

      if (options.name) this.name = options.name;
    }
    if (bclone) Object.assign(this, options);
  }

  /**
   * 判断对象是否有效
   */
  isValidate() {
    return this.id && this.id >= 0;
  }

  /** 转化为简单对象 */
  toObject() {
    return new SnObject(this);
  }
}
