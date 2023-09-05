import React, {useState} from 'react';
import {Input, InputNumber, InputNumberProps, Select, SelectProps} from "antd";
import {GroupProps} from "antd/es/input/Group";


export type Unit = 'D' | 'H' | 'M' | 'S'

export type Duration = {
  value?: number | string,
  /**
   * 默认值为 D
   */
  unit?: Unit
}

export type InputDurationProps = {
  /**
   * group 属性
   */
  groupProps?: GroupProps

  /**
   * 数字输入库属性
   */
  inputNumberProps?: InputNumberProps

  selectProps?: SelectProps

  /**
   * 值
   */
  value?: number | string
  defaultValue?: number | string

  /**
   * 单位
   */
  unit?: Unit

  /**
   * 值变更
   * @param value
   */
  onChange?: (value: string) => void
};

const options: SelectProps['options'] = [
  {
    label: '天',
    value: 'D'
  }, {
    label: '时',
    value: 'H'
  }, {
    label: '分',
    value: 'M'
  }, {
    label: '秒',
    value: 'S'
  }
]

export function parseDurationString(durationString: string): Record<string, number> {
  // 使用正则表达式匹配 Java Duration 字符串的格式
  const regex = /^PT(?:(\d+)D)?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;
  const match = durationString.match(regex);

  if (!match) {
    // 如果字符串格式不匹配，返回 null 或抛出错误，具体取决于您的需求
    return {};
  }
  // 从匹配结果中提取各个部分的值
  const D = match[1] ? parseInt(match[1], 10) : 0;
  const H = match[2] ? parseInt(match[2], 10) : 0;
  const M = match[3] ? parseInt(match[3], 10) : 0;
  const S = match[4] ? parseInt(match[4], 10) : 0;
  return {
    D,
    H,
    M,
    S
  }
}

/**
 * 转换成字符串
 * @param number 数字
 * @param unit 单位
 */
export function toDurationString(number: number, unit: Unit): string {
  return `PT${number}${unit}`
}

export function InputDuration(props: InputDurationProps) {
  const {value, onChange, defaultValue, unit: defaultUnit, groupProps, inputNumberProps, selectProps} = props;

  let initNumber = 1, initUnit = defaultUnit ?? 'D';
  if (typeof value === 'string') {
    const v = parseDurationString(value);
    initNumber = v[initUnit];
  } else if (typeof defaultValue === 'string') {
    const v = parseDurationString(defaultValue);
    initNumber = v[initUnit];
  }

  const [number, setNumber] = useState(initNumber)
  const [unit, setUnit] = useState(initUnit)

  const triggerChange = () => {
    // Should provide an event to pass value to Form.
    if (onChange) {
      onChange(toDurationString(number, unit));
    }
  };

  function handleNumberChange(number: number) {
    setNumber(number);
    triggerChange()
  }

  function handleUnitChange(u: Unit) {
    setUnit(u)
    triggerChange()
  }

  return (
    <Input.Group compact {...groupProps}>
      <InputNumber step={1} defaultValue={1} {...inputNumberProps} value={number} onChange={handleNumberChange}/>
      <Select options={options} {...selectProps} value={unit} onChange={handleUnitChange}/>
    </Input.Group>
  )
}
