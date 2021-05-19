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
