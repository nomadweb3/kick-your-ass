import React, { useState, useEffect } from 'react';
import './App.css';
import TwitterCard from './components/TwitterCard';
import KickAssButton from './components/KickAssButton';
import KissFaceButton from './components/KissFaceButton';
import RankingTab from './components/RankingTab';
import bot from './assets/bot.png';
import { Actor, HttpAgent } from '@dfinity/agent'; // 导入 DFINITY 客户端库
import { idlFactory as backendIDL } from './dids/backend.did';

const API_BASE_URL = 'https://your-api-url.com'; // 替换成实际的API地址
const CANISTER_ID = 'ybqqu-5qaaa-aaaan-qeaua-cai'; // 替换成您的 Canister ID
const AGENT_OPTIONS = { host: 'https://ic0.app' }; // 替换为合适的 Internet Computer 节点

function App() {
  const [twitterHandle, setTwitterHandle] = useState('');
  const [kickCount, setKickCount] = useState(0); // 初始化 kickCount
  const [kissCount, setKissCount] = useState(0); // 初始化 kissCount
  const [kickData, setKickData] = useState<[string, bigint][]>([]);
  const [kissData, setKissData] = useState<[string, bigint][]>([]);

  const agent = new HttpAgent(AGENT_OPTIONS);
  const actor = Actor.createActor(backendIDL, { agent, canisterId: CANISTER_ID });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const kickArray = (await actor.getKicksFromLargeToSmall()) as [string, bigint][];
        const kissArray = (await actor.getKisssFromLargeToSmall()) as [string, bigint][];
        console.log('kickArray : ', kickArray);
        console.log('kissArray : ', kissArray);
        setKickData(kickArray);
        setKissData(kissArray);
      } catch (error) {
        console.error('获取排序后的数据失败:', error);
      }
    };

    fetchData();
  }, []); // 仅在组件挂载时获取数据

  const handleTwitterHandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTwitterHandle(e.target.value);
  };

  const handleImportClick = async () => {
    const kickResult = await actor.getKickByHandle(twitterHandle);
    const kissResult = await actor.getKissByHandle(twitterHandle);
    console.log('getKickByHandle result : ', kickResult);
    console.log('getKissByHandle result : ', kissResult);
    setKickCount(Number(kickResult));
    setKissCount(Number(kissResult));
  };

  useEffect(() => {
    // 在组件挂载时从 Canister 中获取 kickCount
    handleImportClick();
  }, []); // 通过传递空数组来确保仅在组件挂载时执行

  return (
    <div className="App">
      <h1>kick-your-ass</h1>
      <input
        type="text"
        placeholder="Enter Twitter Handle"
        value={twitterHandle}
        onChange={handleTwitterHandleChange}
      />
      <button onClick={handleImportClick}>Import</button>
      <div className="twitter-card-container">
        <TwitterCard
          handle={twitterHandle}
          avatarUrl={bot}
          kickCount={kickCount} 
          kissCount={kissCount} 
        />
      </div>
      <div className="ranking-container">
        <RankingTab name='Kick Ranking'rankingData={kickData}/>
      </div>
      <div className="ranking-container">
        <RankingTab name='Kiss Ranking'rankingData={kissData}/>
      </div>
    </div>
  );
}

export default App;
