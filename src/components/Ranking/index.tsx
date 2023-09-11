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

// const userTwitterInfoMap = new Map<string, UserTwitterInfo>();
// async function getALLUserTwitterInfo(data: [string, bigint][]) {
//     console.log('data : ', data);
//     for(const item of data) {
//         if(userTwitterInfoMap.has(item[0])) continue;
//         const result = await fetchUserTwitterInfo(item[0]);
//         console.log('%s : ', item[0], result);
//         if(result != null) userTwitterInfoMap.set(item[0], result);
//     }
// }

const layOutStyle: React.CSSProperties = {
    height: '100%',
};

const contentStyle: React.CSSProperties = {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
};

// interface InfoCardWrapperProps {
//     name: string;
// }
  
// const InfoCardWrapper: React.FC<InfoCardWrapperProps> = ({ name }) => {
//     const [userTwitterInfo, setUserTwitterInfo] = useState<UserTwitterInfo | null>();
  
//     useEffect(() => {
//       const fetchData = async () => {
//         const result = await fetchUserTwitterInfo(name);
//         console.log('InfoCardWrapper : ', name, result);
//         setUserTwitterInfo(result);
//       };

//       fetchData();
//     }, [name]);
//     return <InfoCard avatarUrl={userTwitterInfo ? userTwitterInfo.profilePicUrl : avartPNG} name={name} />;
// };

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
        width: 150,
        align: 'center',
        render: (name) => {
            // if (userTwitterInfoMap.has(name)) {
            //     const result = userTwitterInfoMap.get(name);
            //     if(result != undefined) {
            //         return (
            //             <InfoCard avatarUrl={result.profilePicUrl} name={name} />
            //         );
            //     }
            // };
            
            return (
                // <InfoCard avatarUrl={avartPNG} name={name} />
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
            );
        }
    },
    {
        title: 'Kiss Count',
        dataIndex: 'value',
        key: 'value',
        width: 90,
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

    useEffect(() => {
        const fetchData = async () => {
          try {
            const kissArray = (await actor.getKisssFromLargeToSmall()) as [string, bigint][];
            setKissData(kissArray);
            console.log('kissArray : ', kissArray);
            setDataLoaded(false); // 数据加载完成后设置状态为true
            console.log('getALLUserTwitterInfo : ', kissArray);
            // getALLUserTwitterInfo(kissArray)
          } catch (error) {
            console.error('获取排序后的数据失败:', error);
          }
        };

        fetchData(); //确保在挂载时立即加载数据
    }, [reloadKissRanking]); 

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
                width: '320px',
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

    useEffect(() => {
        const fetchData = async () => {
          try {
            const kickArray = (await actor.getKicksFromLargeToSmall()) as [string, bigint][];
            setKickData(kickArray);
            console.log('kickArray : ', kickArray);
            setDataLoaded(false); // 数据加载完成后设置状态为true
            // getALLUserTwitterInfo(kickArray)
          } catch (error) {
            console.error('获取排序后的数据失败:', error);
          }
        };
        fetchData(); //确保在挂载时立即加载数据
    }, [reloadKickRanking]); 

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
                width: '320px',
                marginRight: '80px',
            }}
        />
    )
}
export default KissRanking;