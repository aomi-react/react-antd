import * as React from 'react';
import { InputNumber as ANTDInputNumber, Tooltip } from 'antd';
import { InputNumberProps as ANTDInputNumberProps } from 'antd/es/input-number';
import * as accounting from 'accounting';

export type RenderFunction = (value, valueText) => React.ReactNode;

export interface InputNumberProps extends ANTDInputNumberProps {
  tip?: string | RenderFunction;
  type?: 'number' | 'currency'
  format?: any
}

/**
 * 带有Tooltip的InputNumber输入框
 */
export class InputNumber extends React.Component<InputNumberProps, any> {

  render() {
    const { value, type, format, tip, ...props } = this.props;

    let titleText = value;
    let inputProps = {};
    switch (type) {
      case 'number':
        titleText = accounting.formatNumber(value, ...(format || []));
        break;
      case 'currency':
        // 为货币类型时，添加最大值
        inputProps = {
          max: 99999999999.99,
          min: 0.00,
          precision: 2
        };
        titleText = accounting.formatMoney(value, format || {});
        break;
    }
    let title;
    if (tip) {
      title = typeof tip === 'string' ? (
        <React.Fragment>
          {`${tip}: ${titleText}`}
        </React.Fragment>
      ) : tip(value, titleText);
    } else {
      title = (
        <React.Fragment>
          {titleText}
        </React.Fragment>
      );
    }
    return (
      <Tooltip placement="topLeft"
               title={title}
               trigger="focus"
      >
        <ANTDInputNumber {...inputProps}
                         {...props}
                         value={value}
        />
      </Tooltip>
    );
  }
}

