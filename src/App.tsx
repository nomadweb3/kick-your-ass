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
import { Button, Space, Layout } from 'antd';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import avatarPNG from './assets/avatar.png';
import { Routes, Route } from 'react-router-dom'
import KissRanking, { KickRanking } from './components/Ranking';
import NotFoundPage from './components/NotFoundPage';
import Header from './components/Header';
import Footer from './components/Footer';

const { Content } = Layout;
const CANISTER_ID = 'ybqqu-5qaaa-aaaan-qeaua-cai'; 
const AGENT_OPTIONS = { host: 'https://ic0.app' }; 

const layOutStyle: React.CSSProperties = {
  height: '100%',
};

const contentStyle: React.CSSProperties = {
  height: '100%',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: '#FFFFFF',
  overflow: 'auto',
};

function App() {
  const agent = new HttpAgent(AGENT_OPTIONS);
  const actor = Actor.createActor(backendIDL, { agent, canisterId: CANISTER_ID });

  const homePage =  (
    <div className="App">
      <Layout style={layOutStyle}>
        <Header />
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
        <Content style={contentStyle}>

          <KissRanking/>
          <TwitterCard/>
          <KickRanking/>

          {/* {importSuccess && (
            <div className="twitter-card-container">
              <TwitterCard
                handle={twitterHandle}
                avatarUrl='https://unssi-hiaaa-aaaah-qcmya-cai.raw.icp0.io/?tokenid=qgy7e-xikor-uwiaa-aaaaa-b4atg-aaqca-aabhz-q'
                kissCount={kissCount} 
                kickCount={kickCount} 
                queryTheHandleCount={queryTheHandleCount}
              />
            </div>
          )} */}

          {/* <div className="ranking-container">
            <RankingTab name='Kick Ranking'rankingData={kickData}/>
          </div>
          <div className="ranking-container">
            <RankingTab name='Kiss Ranking'rankingData={kissData}/>
          </div> */}

        </Content>
        <Footer />
      </Layout>
    </div>
  );
  return (
    <Routes>
      <Route path='' element = {
        homePage
      }/>
      <Route path='ranking' element = {
        <KissRanking/>
      }/>
      <Route path='*' element = {
        <NotFoundPage/>
      }/>
    </Routes>
  )
}

export default App;
