import React, { useState, useEffect } from 'react';
import { Button, Space, Layout, Table} from 'antd';
import Header from '../Header';
import Footer from '../Footer';
import { Actor, HttpAgent } from '@dfinity/agent'; 
import { idlFactory as backendIDL } from '../../dids/backend.did';
import { ColumnsType } from 'antd/es/table';
import { render } from '@testing-library/react';
import InfoCard from '../Basic/InfoCard';
import avartPNG from '../../assets/avatar.png';
import  { UserTwitterInfo, fetchUserTwitterInfo } from '../TwitterCard';

const { Content } = Layout;
const CANISTER_ID = 'ybqqu-5qaaa-aaaan-qeaua-cai'; 
const AGENT_OPTIONS = { host: 'https://ic0.app' }; 
const agent = new HttpAgent(AGENT_OPTIONS);
const actor = Actor.createActor(backendIDL, { agent, canisterId: CANISTER_ID });

interface DataType {
    key: string;
    userInfo: {
        name: string;
        profilePicURL: string;
    };
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
        dataIndex: 'userInfo',
        key: 'userInfo',
        width: 200,
        align: 'center',
        render: (info) => {
            // console.log('info.profilePicURL ', info.profilePicURL);
            return (
                <InfoCard avatarUrl={info.profilePicURL} name={info.name} />
            );
        }
    },
    {
        title: 'Count',
        dataIndex: 'value',
        key: 'value',
        width: 60,
        align: 'center'
    }
]

interface KissRankingProps {
    reloadKissRanking: number;
}

const KissRanking: React.FC<KissRankingProps> = (
    reloadKissRanking,
) => {
    const [kissData, setKissData] = useState<[string, bigint][]>([]);
    const [dataLoaded, setDataLoaded] = useState<boolean>(true); // 添加数据加载完成状态
    const [dataSourece, setDataSource] = useState<DataType[]>([]);
    useEffect(() => {
        const fetchData = async () => {
          try {
            const kissArray = (await actor.getKisssFromLargeToSmall()) as [string, bigint][];
            setKissData(kissArray);
            // console.log('kissArray : ', kissArray);
            setDataLoaded(false); // 数据加载完成后设置状态为true

            const userInfoPromises = kissArray.map(async ([userName, value], index) => {
                const profilePicURL = await actor.getUserTwitterPicURL(userName) as [string];
                if(profilePicURL.length > 0) {
                    const item = {
                        index: index + 1,
                        key: index.toString(),
                        userInfo: {
                            name: userName,
                            profilePicURL: profilePicURL[0],
                        },
                        value: value.toString(),
                    };
                    return item;
                } else {
                    const item = {
                        index: index + 1,
                        key: index.toString(),
                        userInfo: {
                            name: userName,
                            profilePicURL: avartPNG,
                        },
                        value: value.toString(),
                    };
                    return item;
                };
            });
            const _dataSourece: DataType[] = await Promise.all(userInfoPromises);
            setDataSource(_dataSourece);
          } catch (error) {
            console.error('获取排序后的数据失败:', error);
          }
        };

        fetchData(); //确保在挂载时立即加载数据
    }, [reloadKissRanking]); 

    return (
        <Table
            columns={columns}
            dataSource={dataSourece}
            // pagination={false}
            scroll={{y: 600}} 
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
                width: '370px',
                marginLeft: '80px',
            }}
        />
    )
}

interface KickRankingProps {
    reloadKickRanking: number;
};

export const KickRanking: React.FC<KickRankingProps> = (
    reloadKickRanking
) => {
    const [kickData, setKickData] = useState<[string, bigint][]>([]);
    const [dataLoaded, setDataLoaded] = useState<boolean>(true); // 添加数据加载完成状态
    const [dataSourece, setDataSource] = useState<DataType[]>([]);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const kickArray = (await actor.getKicksFromLargeToSmall()) as [string, bigint][];
            setKickData(kickArray);
            // console.log('kickArray : ', kickArray);
            setDataLoaded(false); // 数据加载完成后设置状态为true

            const userInfoPromises = kickArray.map(async ([userName, value], index) => {
                const profilePicURL = await actor.getUserTwitterPicURL(userName) as [string];
                if(profilePicURL.length > 0) {
                    const item = {
                        index: index + 1,
                        key: index.toString(),
                        userInfo: {
                            name: userName,
                            profilePicURL: profilePicURL[0],
                        },
                        value: value.toString(),
                    };
                    return item;
                } else {
                    const item = {
                        index: index + 1,
                        key: index.toString(),
                        userInfo: {
                            name: userName,
                            profilePicURL: avartPNG,
                        },
                        value: value.toString(),
                    };
                    return item;
                };
            });
            const _dataSourece: DataType[] = await Promise.all(userInfoPromises);
            setDataSource(_dataSourece);
          } catch (error) {
            console.error('获取排序后的数据失败:', error);
          }
        };
        fetchData(); //确保在挂载时立即加载数据
    }, [reloadKickRanking]); 

    return (
        <Table
            columns={columns}
            dataSource={dataSourece}
            // pagination={false}
            scroll={{y: 600}} 
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
                width: '370px',
                marginRight: '80px',
            }}
        />
    )
}
export default KissRanking;