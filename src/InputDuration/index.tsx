import React, {useState} from 'react';
import {InputNumber, InputNumberProps, Select, SelectProps, Space} from "antd";
import {SpaceCompactProps} from "antd/es/space/Compact";


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
   * SpaceCompactProps 属性
   */
  spaceCompactProps?: SpaceCompactProps

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

  [key: string]: any
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
  const {
    value,
    onChange,
    defaultValue,
    unit: defaultUnit,
    spaceCompactProps,
    inputNumberProps,
    selectProps,
    disabled,
    className,
  } = props;

  let initNumber: any = undefined, initUnit = defaultUnit ?? 'D';
  if (typeof value === 'string') {
    const v = parseDurationString(value);
    initNumber = v[initUnit];
  } else if (typeof defaultValue === 'string') {
    const v = parseDurationString(defaultValue);
    initNumber = v[initUnit];
  }

  const [number, setNumber] = useState(initNumber)
  const [unit, setUnit] = useState(initUnit)

  const triggerChange = (changeValue: any) => {
    // Should provide an event to pass value to Form.
    if (onChange) {
      const n = changeValue?.number ?? number;
      const u = changeValue?.unit ?? unit;
      onChange(toDurationString(n, u));
    }
  };

  function handleNumberChange(number: number) {
    setNumber(number);
    triggerChange({
      number
    })
  }

  function handleUnitChange(u: Unit) {
    setUnit(u)
    triggerChange({
      unit: u
    })
  }

  return (
    <Space.Compact className={className} {...spaceCompactProps}>
      <InputNumber step={1}
                   style={{width: '75%'}}
                   {...inputNumberProps}
                   value={number}
                   onChange={handleNumberChange}
                   disabled={disabled}
      />
      <Select options={options}
              style={{width: '25%'}}
              {...selectProps}
              value={unit}
              onChange={handleUnitChange}
              disabled={disabled}
      />
    </Space.Compact>
  )
}
