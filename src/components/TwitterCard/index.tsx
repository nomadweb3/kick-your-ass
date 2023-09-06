import React from 'react';
import './index.css';
import { Button, Space, notification } from 'antd';
import { Actor, HttpAgent } from '@dfinity/agent'; 
import { idlFactory as backendIDL } from '../../dids/backend.did';
import type { NotificationPlacement } from 'antd/es/notification/interface';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Result as FuncResult, Error as canisterFuncError } from '../../dids/service';
interface TwitterCardProps {
  handle: string;
  avatarUrl: string;
  kickCount: number;
  kissCount: number;
  queryTheHandleCount: () => void;
}

const CANISTER_ID = 'ybqqu-5qaaa-aaaan-qeaua-cai'; 
const AGENT_OPTIONS = { host: 'https://ic0.app' }; 
const agent = new HttpAgent(AGENT_OPTIONS);
const actor = Actor.createActor(backendIDL, { agent, canisterId: CANISTER_ID });

const TwitterCard: React.FC<TwitterCardProps> = ({
  handle,
  avatarUrl,
  kickCount,
  kissCount,
  queryTheHandleCount
}) => {

  const onKissFace = async () => {
    toast.info('Kiss ing !');
    const kissResult = await actor.kiss(handle) as FuncResult;
    console.log('Kiss : ', kissResult);
    if('ok' in kissResult) {
      queryTheHandleCount();
      toast.success('Kiss Success !');
    } else {
      toast.error(Object.keys(kissResult.err)[0])
    }
  }

  const onKickAss = async () => {
    toast.info('Kick ing !');
    const kickResult = await actor.kick(handle) as FuncResult;
    console.log('Kick : ', kickResult);
    if('ok' in kickResult) {
      queryTheHandleCount();
      toast.success('Kick Success !');
    } else {
      toast.error(Object.keys(kickResult.err)[0])
    }
  }



  return (
    <div className="twitter-card">
      <img className='avatar' src={avatarUrl} alt={`${handle}'s avatar`} />
      {/* <h3>{handle}</h3> */}
      <br />
      <br />
      <div className="actions">
        <Space wrap>
          <Button type="primary" onClick={onKissFace}>Kiss Face</Button>
          <Button  onClick={onKickAss}>Kick Ass</Button>
        </Space>
      </div>
      <div className="stats">
        <p>Kick Count :   {kickCount}</p>
        <p>Kiss Count :   {kissCount}</p>
      </div>
    </div>
  );
};

export default TwitterCard;
