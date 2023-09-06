import { SearchOutlined } from '@ant-design/icons';
import React from 'react';
import { Button, Input, Select, Space } from 'antd';

interface AntdInputProps {
    placeholder?: string;
    value?: string;
    onchage?: (e: React.ChangeEvent<HTMLInputElement>) => void
}
const AntdInput: React.FC<AntdInputProps> = ({
    placeholder, value, onchage
}) => (
  <Space direction="vertical" size="middle">
    <Space.Compact style={{ width: '100%' }}>
        <Input placeholder={placeholder} value={value} onChange={onchage}/>
    </Space.Compact>
  </Space> 
);

export default AntdInput;