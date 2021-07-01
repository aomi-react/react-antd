import * as React from 'react';
import { Descriptions, DescriptionsProps } from 'antd';
import { FeeRate, feeRateType } from '@aomi/common-service/FeeRate/FeeRate';

/**
 * 费率展示
 */
export function FeeRateText({ type, value, min, max, ...props }: FeeRate & DescriptionsProps) {
  const unit = type === feeRateType.cap ? '元' : '%';
  return (
    <Descriptions size="small" column={1} {...props}>
      <Descriptions.Item label="每笔收费">{`${value}${unit}`}</Descriptions.Item>
      {type !== feeRateType.cap && (
        <Descriptions.Item label={'每笔最低收费'}>{`${min}元`}</Descriptions.Item>
      )}
      {type === feeRateType.capPercentage && (
        <Descriptions.Item label="每笔最高收费">{`${max}元`}</Descriptions.Item>
      )}
    </Descriptions>
  );
}
