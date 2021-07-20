import React, { Component } from 'react';
import { Input, Select, SelectProps } from 'antd';
import { autoBind } from 'jsdk/autoBind';
import { FeeRate, feeRateType, FeeRateType } from '@aomi/common-service/FeeRate/FeeRate';
import { feeRateTypeText } from '@aomi/common-service/FeeRate/zh-cn';
import { InputNumber, InputNumberProps } from '../InputNumber';
import { obj2Options } from '../utils/OptionUtil';

export interface InputFeeRateProps {
  onChange?: (value: FeeRate) => void
  value?: FeeRate

  typeProps?: SelectProps<FeeRateType>
  valueProps?: InputNumberProps
  minProps?: InputNumberProps
  maxProps?: InputNumberProps
  containerProps?: any
}

export function validator(rule, value) {
  try {
    if (!value.value && value.value !== 0) {
      return Promise.reject('请输入每笔收费费率');
    }
    if (value.type === feeRateType.capPercentage) {
      const { min, max } = value;
      if (min >= max) {
        return Promise.reject('每笔最高收费必须大于每笔最低收费');
      }
    }
  } catch (e) {
    return Promise.reject(e.error);
  }
  return Promise.resolve();
}

@autoBind
export class InputFeeRate extends Component<InputFeeRateProps, any> {

  static getDerivedStateFromProps(nextProps) {
    // Should be a controlled component.
    if (Reflect.has(nextProps, 'value')) {
      return {
        type: feeRateType.percentage,
        value: '0',
        min: 0.00,
        max: 0.00,
        ...nextProps.value
      };
    }
    return {
      type: feeRateType.percentage,
      value: '0',
      min: 0.00,
      max: 0.00,
    };
  }

  state;

  constructor(props) {
    super(props);
    const value = props.value || {};
    this.state = {
      ...value,
      type: value.type || feeRateType.percentage,
      value: '',
      min: 0.00,
      max: 0.00
    };
  }

  triggerChange = changedValue => {
    // Should provide an event to pass value to Form.
    const { onChange } = this.props;
    if (onChange) {
      onChange({
        ...this.state,
        ...changedValue
      });
    }
  };

  handleTypeChange(type) {
    if (!Reflect.has(this.props, 'value')) {
      this.setState({ type });
    }
    this.triggerChange({ type });
  }

  handleValueChange(value) {
    if (!Reflect.has(this.props, 'value')) {
      this.setState({ value });
    }
    this.triggerChange({ value });

  }

  handleMinChange(min) {
    if (!Reflect.has(this.props, 'value')) {
      this.setState({ min });
    }
    this.triggerChange({ min });
  }

  handleMaxChange(max) {
    if (!Reflect.has(this.props, 'value')) {
      this.setState({ max });
    }
    this.triggerChange({ max });
  }

  render() {
    const { typeProps, valueProps, minProps, maxProps, containerProps } = this.props;
    const { type, value, min = 0.00, max = 0.00 } = this.state;
    let col;
    switch (type) {
      case feeRateType.cap:
        col = 2;
        break;
      case feeRateType.percentage:
        col = 3;
        break;
      case feeRateType.capPercentage:
        col = 4;
        break;
      default:
        col = 4;
    }
    const style = { width: `${100 / col}%` };
    return (
      <Input.Group compact {...containerProps}>
        <Select options={obj2Options(feeRateTypeText)}
                onChange={this.handleTypeChange}
                value={type}
                style={style}
                {...typeProps}
        />
        <InputNumber value={value}
                     type="currency"
                     onChange={this.handleValueChange}
                     placeholder="请输入每笔收费费率"
                     tip={((value) => `每笔收费: ${value || 0}${type === feeRateType.cap ? '元' : '%'}`)}
                     style={style}
                     {...valueProps}
        />
        {type !== feeRateType.cap && (
          <InputNumber value={min}
                       type="currency"
                       onChange={this.handleMinChange}
                       tip="每笔最低收费"
                       style={style}
                       {...minProps}
          />
        )}
        {type === feeRateType.capPercentage && (
          <InputNumber value={max}
                       type="currency"
                       onChange={this.handleMaxChange}
                       tip="每笔最高收费"
                       style={style}
                       {...maxProps}
          />
        )}
      </Input.Group>
    );
  }
}
