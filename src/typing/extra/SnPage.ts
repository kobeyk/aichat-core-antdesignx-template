/** 分页对象 */
export default interface GxPage {
  /** 总记录数 */
  totalItems?: string | number;
  /** 总页数 */
  totalPages?: string | number;
  /** 当前页数 */
  pageNo?: string | number;
  /** 一页最大显示记录数 */
  pageSize?: string | number;
  /** 当前页面实体数量 */
  pageItems?: string | number;
  /** 记录集*/
  items?: Array<any>;
}
