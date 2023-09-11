import React, {useState} from 'react';
import './index.css';
import { Button, Space, notification } from 'antd';
import { Actor, HttpAgent } from '@dfinity/agent'; 
import { idlFactory as backendIDL } from '../../dids/backend.did';
import type { NotificationPlacement } from 'antd/es/notification/interface';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Result as FuncResult, Error as canisterFuncError } from '../../dids/service';
import avatarPNG from '../../assets/avatar.png';
import InfoCard from '../Basic/InfoCard';
import axios from 'axios';

interface TwitterCardProps {
  handleSetReloadKissRanking: () => void;
  handleSetReloadKickRanking: () => void;
}

const CANISTER_ID = 'ybqqu-5qaaa-aaaan-qeaua-cai'; 
const AGENT_OPTIONS = { host: 'https://ic0.app' }; 
const agent = new HttpAgent(AGENT_OPTIONS);
const actor = Actor.createActor(backendIDL, { agent, canisterId: CANISTER_ID });

export interface UserTwitterInfo {
  username: string;
  profilePicUrl: string;
}

export async function fetchUserTwitterInfo(twitterHandle: string): Promise<UserTwitterInfo | null> {
  const options = {
    method: 'GET',
    url: 'https://twitter154.p.rapidapi.com/user/details',
    params: {
      username: twitterHandle,
    },
    headers: {
      'X-RapidAPI-Key': '502f2f954emsh346c4bd06514a49p1a446djsnb7d1dd389a43',
      'X-RapidAPI-Host': 'twitter154.p.rapidapi.com'
    }
  };
  
  try {
    const response = await axios.request(options);
    const userTwitterInfo: UserTwitterInfo = {
      username: response.data.username,
      profilePicUrl: response.data.profile_pic_url,
    };
    console.log('fetchUserTwitterInfo : ', response.data);
    return userTwitterInfo;
  } catch (error) {
    console.error('fetchUserTwitterInfo : ', error);
    return null;
  }
}

const TwitterCard: React.FC<TwitterCardProps> = ({
  handleSetReloadKissRanking,
  handleSetReloadKickRanking,
}) => {
  const [twitterHandle, setTwitterHandle] = useState('');
  const [kickCount, setKickCount] = useState(0); // 初始化 kickCount
  const [kissCount, setKissCount] = useState(0); // 初始化 kissCount
  const [importSuccess, setImportSuccess] = useState(false); // 新增状态来标志是否成功导入
  const [userTwitterInfo, setUserTwitterInfo] = useState<UserTwitterInfo | null>(null); // 新增状态来标志是否成功导入

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
    queryTheHandleCount();
    const fetchUserTwitterInfoResult = await fetchUserTwitterInfo(twitterHandle);
    if(fetchUserTwitterInfo == null || fetchUserTwitterInfoResult?.profilePicUrl == null) {
      toast.error('Invalid Twitter Handle');
      return;
    } else {
      setUserTwitterInfo(fetchUserTwitterInfoResult);
    };
    if(isCreatedResult) {
      setImportSuccess(true);
      queryTheHandleCount(); 
      // toast.info('Have imported twitter handle !');
      return;
    } else {
      // 导入handle
      toast.info('Importing Twitter Handle !');
      const createResult = await actor.create(twitterHandle) as FuncResult;
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

  const onKissFace = async () => {
    toast.info('Kiss ing !');
    const kissResult = await actor.kiss(twitterHandle) as FuncResult;
    console.log('Kiss : ', kissResult);
    if('ok' in kissResult) {
      queryTheHandleCount();
      toast.success('Kiss Success !');
      handleSetReloadKissRanking();
    } else {
      toast.error(Object.keys(kissResult.err)[0])
    }
  }

  const onKickAss = async () => {
    toast.info('Kick ing !');
    const kickResult = await actor.kick(twitterHandle) as FuncResult;
    console.log('Kick : ', kickResult);
    if('ok' in kickResult) {
      queryTheHandleCount();
      toast.success('Kick Success !');
      handleSetReloadKickRanking();
    } else {
      toast.error(Object.keys(kickResult.err)[0])
    }
  }

  return (
    <div className='container'>
      <div className='twitterCard'>
        <div className='title'>
          Import Twitter Handle
        </div>
        <div className='content'>
          <div className='search'>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M21 21L16.65 16.65" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <input className='input 'type='text' value={twitterHandle} placeholder='elonmusk' onChange={handleTwitterHandleChange}/>
          </div>
        <div className='meta'>
          <img className='avatar' 
            // src={userTwitterInfo ? userTwitterInfo.profilePicUrl : avatarPNG}
            src={avatarPNG} 
            alt='avatar'
          />
          <button className='importButton' onClick={handleImportClick}>
            <div className='title'>Import</div> 
          </button>
        </div>
      </div>
      <div className='button'>
        <button className='kick' onClick={onKickAss}>
          <div className='title'>
            KICK ASS
          </div>
        </button>
        <button className='kiss' onClick={onKissFace}>
          <div className='title'>
            KISS FACE
          </div>
        </button>
        </div>
      </div> 
      {
        importSuccess &&
        (
          <div className='recently'>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <g opacity="0.16">
                <circle cx="10" cy="10" r="8" stroke="white" stroke-width="4"/>
                <circle cx="10" cy="10" r="8" stroke="black" stroke-opacity="0.56" stroke-width="4"/>
              </g>
              <path d="M2 10C2 14.4183 5.58172 18 10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2" stroke="white" stroke-width="4" stroke-linecap="round"/>
              <path d="M2 10C2 14.4183 5.58172 18 10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2" stroke="black" stroke-opacity="0.56" stroke-width="4" stroke-linecap="round"/>
            </svg>
            <div className='title'>Recently</div>
          </div>
        )
      }

      { 
        importSuccess && 
        (
          <div className='kiss-kick-container'>
            <div className='box'>
              <InfoCard 
                avatarUrl={userTwitterInfo ? userTwitterInfo.profilePicUrl : avatarPNG} 
                name={twitterHandle} 
              />
            </div>
            <div className='count'>
              Get {kissCount}
            </div>
            <div className='kiss'>
              <div className='title'>kiss</div>
            </div>
          </div>
        )
      }
      {
        importSuccess &&
        (
          <div className='kiss-kick-container'>
            <div className='box'>
              <InfoCard 
                avatarUrl={userTwitterInfo ? userTwitterInfo.profilePicUrl : avatarPNG} 
                name={twitterHandle} 
              />
            </div>
            <div className='count'>
              Get {kickCount}
            </div>
            <div className='kick'>
              <div className='title'>KICK</div>
            </div>
          </div>
        )
      }

    </div>
  );
};

export default TwitterCard;
