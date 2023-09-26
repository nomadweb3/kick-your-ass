import CountUp from 'react-countup';
import { Col, Row, Statistic } from 'antd';
import { HttpAgent, Actor } from '@dfinity/agent';
import { idlFactory as backendIDL } from '../../dids/backend.did';
import { useEffect, useState } from 'react';
import Header from '../Header';

const formatter = (value: number) => <CountUp end={value} separator="," />;
const agent = new HttpAgent({
  host: 'https://ic0.app'
})
const actor = Actor.createActor(backendIDL, { agent, canisterId: 'ybqqu-5qaaa-aaaan-qeaua-cai' });

const App: React.FC = () => {
  const [totalUser, setTotalUser] = useState<number>();
  const [totalKiss, setTotalKiss] = useState<number>();
  const [totalKick, setTotalKick] = useState<number>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const _totalUser = await actor.getTotalUserAmount() as number;
        // console.log('_totalUser : ', _totalUser);
        setTotalUser(_totalUser);
        const _totalKiss = await actor.getTotalKissAmount() as number;
        setTotalKiss(_totalKiss);
        const _totalKick = await actor.getTotalKickAmount() as number;
        setTotalKick(_totalKick);
      } catch(err) {
        console.error('统计数据获取失败 : ', err);
      }
    };
    fetchData();
  }, []);

  return (
    <>
        <Header/>
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <Row gutter={16}>
                <Col span={12}>
                    <Statistic title="Acc. Kicks " value={totalKick} formatter={formatter} />
                </Col>
                <Col span={12}>
                    <Statistic title="Acc. Kisses " value={totalKiss} formatter={formatter} />
                </Col>
                <Col span={12}>
                    <Statistic title="Total Users" value={totalUser} formatter={formatter} />
                </Col>
            </Row>
        </div>
    </>
  );
}

export default App;