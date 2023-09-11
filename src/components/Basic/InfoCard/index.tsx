import React from  'react';
import { Avatar, Space } from 'antd';
import { UserOutlined } from '@ant-design/icons';

interface InfoCardProps {
    avatarUrl: string;
    name: string;
};

export const InfoCard: React.FC<InfoCardProps> = ({
    avatarUrl,
    name,
}) => {
    return (
        <div style={{
            display: 'flex',
            gap: '12px',
        }}>
            <Avatar size={24} src={avatarUrl} alt='user avatar'/>
            <div style={{
                color: '#000',
                fontFamily: 'Inter',
                fontSize: '16px',
                fontStyle: 'normal',
                fontWeight: '400',
                lineHeight: '24px', /* 150% */
            }}>
                {name}
            </div>
        </div>

    )
}

export default InfoCard;