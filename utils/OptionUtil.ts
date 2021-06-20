import { Option } from '../BaseSelect/Option';

/**
 * 转换一个对象为下拉框所需要的options数组
 * @param obj
 */
export function obj2Options(obj): Array<Option> {
  const result: Array<Option> = [];
  obj && Object.keys(obj).forEach(key => result.push({
    label: obj[key],
    value: key
  }));
  return result;
}


export type Options<T> = {
  /**
   * 获取label值,默认值为 name || label || code || index;
   * @param entity 数据对象
   */
  getLabel?: (entity: T, index: number) => string
  /**
   * 获取value值,默认返回 id || code || name || value || index;

   * @param entity 数据对象
   */
  getValue?: (entity: T, index: number) => string
}

/**
 * 转换后端的实体对象为下拉框所需要的options数组
 * @param entities 后端实体对象
 * @param options 转换时选项参数
 */
export function entity2Options<T>(entities: T | Array<T>, options: Options<T> = {}): Array<Option> {
  const result: Array<Option> = [];
  if (Array.isArray(entities) && entities.length > 0) {
    entities.forEach((item: any, index) => {
      result.push({
        label: options.getLabel ? options.getLabel(item, index) : (item.name || item.label || item.code || index),
        value: options.getValue ? options.getValue(item, index) : (item.id || item.code || item.name || item.value || index)
      });
    });
  } else if (!!entities) {
    const tmp: any = entities;
    result.push({
      label: options.getLabel ? options.getLabel(tmp, 0) : (tmp.name || tmp.label || tmp.code || 0),
      value: options.getValue ? options.getValue(tmp, 0) : (tmp.id || tmp.code || tmp.name || tmp.value || 0)
    });
  }
  return result;
}
