import React, { useState, useEffect } from 'react';
import { Button, Space, Layout, Table} from 'antd';
import Header from '../Header';
import Footer from '../Footer';
import { Actor, HttpAgent } from '@dfinity/agent'; 
import { idlFactory as backendIDL } from '../../dids/backend.did';
import { ColumnsType } from 'antd/es/table';
import { render } from '@testing-library/react';

const { Content } = Layout;
const CANISTER_ID = 'ybqqu-5qaaa-aaaan-qeaua-cai'; 
const AGENT_OPTIONS = { host: 'https://ic0.app' }; 
const agent = new HttpAgent(AGENT_OPTIONS);
const actor = Actor.createActor(backendIDL, { agent, canisterId: CANISTER_ID });

const layOutStyle: React.CSSProperties = {
    height: '100%',

};

const contentStyle: React.CSSProperties = {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
};

interface DataType {
    key: string;
    name: string;
    value: string;
}

const columns: ColumnsType<DataType> = [
    {
        title: 'index',
        dataIndex: 'index',
        key: 'index',
        width: 60,        
        align: 'center'
    },
    {
        title: 'Twitter Info',
        dataIndex: 'name',
        key: 'name',
        width: 100,
        align: 'center'
    },
    {
        title: 'Kiss Count',
        dataIndex: 'value',
        key: 'value',
        width: 90,
        align: 'center'
    }
]

const KissRanking: React.FC = () => {
    const [kissData, setKissData] = useState<[string, bigint][]>([]);
    const [dataLoaded, setDataLoaded] = useState<boolean>(true); // 添加数据加载完成状态

    useEffect(() => {
        const fetchData = async () => {
          try {
            const kissArray = (await actor.getKisssFromLargeToSmall()) as [string, bigint][];
            setKissData(kissArray);
            console.log('kissArray : ', kissArray);
            setDataLoaded(false); // 数据加载完成后设置状态为true
          } catch (error) {
            console.error('获取排序后的数据失败:', error);
          }
        };

        fetchData(); //确保在挂载时立即加载数据
    }, []); 

    return (
        <Table
            columns={columns}
            dataSource={
                kissData.map(([name, value], index) => {
                    const item = {
                        index: index + 1,
                        key: index.toString(),
                        name,
                        value: value.toString(),
                    };
                    // console.log('item : ', item);
                    return item;
                })
            }
            pagination={false}
            scroll={{y: 400}} 
            title={
                () => <span style={{
                    color: '#000',
                    textAlign: 'right',
                    fontFamily: 'Inter',
                    fontSize: '14px',
                    fontStyle: 'normal',
                    fontWeight: '600',
                    lineHeight: '20px',
                    letterSpacing: '0.84px',
                    textTransform: 'uppercase',
                }}>Kiss Ranking</span>
            }
            loading={dataLoaded}
            size='middle'
            style={{
                width: '300px',
                marginLeft: '80px',
            }}
        />
    )
}

export const KickRanking: React.FC = () => {
    const [kickData, setKickData] = useState<[string, bigint][]>([]);
    const [dataLoaded, setDataLoaded] = useState<boolean>(true); // 添加数据加载完成状态

    useEffect(() => {
        const fetchData = async () => {
          try {
            const kickArray = (await actor.getKicksFromLargeToSmall()) as [string, bigint][];
            setKickData(kickArray);
            console.log('kickArray : ', kickArray);
            setDataLoaded(false); // 数据加载完成后设置状态为true
          } catch (error) {
            console.error('获取排序后的数据失败:', error);
          }
        };

        fetchData(); //确保在挂载时立即加载数据
    }, []); 

    return (
        <Table
            columns={columns}
            dataSource={
                kickData.map(([name, value], index) => {
                    const item = {
                        index: index + 1,
                        key: index.toString(),
                        name,
                        value: value.toString(),
                    };
                    // console.log('item : ', item);
                    return item;
                })
            }
            pagination={false}
            scroll={{y: 400}} 
            title={
                () => <span style={{
                    color: '#000',
                    textAlign: 'right',
                    fontFamily: 'Inter',
                    fontSize: '14px',
                    fontStyle: 'normal',
                    fontWeight: '600',
                    lineHeight: '20px',
                    letterSpacing: '0.84px',
                    textTransform: 'uppercase',
                }}>Kick Ranking</span>
            }
            loading={dataLoaded}
            size='middle'
            style={{
                width: '300px',
                marginRight: '80px',
            }}
        />
    )
}
export default KissRanking;