import React, { useState, useEffect } from 'react';
import './App.css';
import TwitterCard from './components/TwitterCard';
import KickAssButton from './components/KickAssButton';
import KissFaceButton from './components/KissFaceButton';
import RankingTab from './components/RankingTab';
import { Actor, HttpAgent } from '@dfinity/agent'; 
import { idlFactory as backendIDL } from './dids/backend.did';
import { Result as CreateResult, Error as canisterFuncError } from './dids/service';
import AntdInput from './components/Basic/Input';
import { Button, Space } from 'antd';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CANISTER_ID = 'ybqqu-5qaaa-aaaan-qeaua-cai'; 
const AGENT_OPTIONS = { host: 'https://ic0.app' }; 

function App() {
  const [twitterHandle, setTwitterHandle] = useState('');
  const [kickCount, setKickCount] = useState(0); // 初始化 kickCount
  const [kissCount, setKissCount] = useState(0); // 初始化 kissCount
  const [kickData, setKickData] = useState<[string, bigint][]>([]);
  const [kissData, setKissData] = useState<[string, bigint][]>([]);
  const [importSuccess, setImportSuccess] = useState(false); // 新增状态来标志是否成功导入
  const [refreshInterval, setRefreshInterval] = useState<number>(3000); // 刷新间隔，单位毫秒 (3秒)

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

    const intervalId = setInterval(() => {
      fetchData();
    }, refreshInterval);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [refreshInterval]); 

  const handleTwitterHandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTwitterHandle(e.target.value);
  };

  const queryTheHandleCount = async () => {
    if(twitterHandle == '') return;
    const kickResult = await actor.getKickByHandle(twitterHandle);
    const kissResult = await actor.getKissByHandle(twitterHandle);
    console.log('getKickByHandle result : ', kickResult);
    console.log('getKissByHandle result : ', kissResult);
    setKickCount(Number(kickResult));
    setKissCount(Number(kissResult));
  }

  const handleImportClick = async () => {
    if(twitterHandle == '') {
      toast.warning('Input empty twitter handle !');
      return;
    }
    // 查询是否已经导入
    const isCreatedResult = await actor.isCreated(twitterHandle);
    console.log('isCreatedResult : ', isCreatedResult);

    if(isCreatedResult) {
      setImportSuccess(true);
      queryTheHandleCount(); 
      toast.info('Have imported twitter handle !');
      return;
    } else {
      // 导入handle
      toast.info('Importing Twitter Handle !');
      const createResult = await actor.create(twitterHandle) as CreateResult;
      console.log('createResult : ', createResult);
      if('ok' in createResult) {
        setImportSuccess(true); 
        queryTheHandleCount(); 
        toast.success("Import Twitter Handle Success !");
        return;
      } else {
        setImportSuccess(false); 
        toast.error(Object.keys(createResult.err)[0]);
        console.log(Object.keys(createResult.err)[0]);
      }
    }
  };

  return (
    <div className="App">
      <h1>kick-your-ass</h1>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <AntdInput
        placeholder="Enter Twitter Handle"
        value={twitterHandle}
        onchage={handleTwitterHandleChange}
      />
      <Space wrap>
        <Button type="primary" onClick={handleImportClick}>Import</Button>
      </Space>

      <br />
      <br />
      
      <img className='avatar' src=''/>
      
      {importSuccess && (
        <div className="twitter-card-container">
          <TwitterCard
            handle={twitterHandle}
            avatarUrl='https://unssi-hiaaa-aaaah-qcmya-cai.raw.icp0.io/?tokenid=qgy7e-xikor-uwiaa-aaaaa-b4atg-aaqca-aabhz-q'
            kickCount={kickCount} 
            kissCount={kissCount} 
            queryTheHandleCount={queryTheHandleCount}
          />
        </div>
      )}

      <div className="ranking-container">
        <RankingTab name='Kick Ranking'rankingData={kickData}/>
      </div>
      <div className="ranking-container">
        <RankingTab name='Kiss Ranking'rankingData={kissData}/>
      </div>

    </div>
  );
}

function getErrorString(result: CreateResult): string | null {
  if ('err' in result) {
    // 有错误信息，将其转换为字符串并返回
    return JSON.stringify(result.err);
  } else {
    // 没有错误信息，返回 null 或者其他适当的值
    return null;
  }
}

export default App;
