import React, { useState, useEffect } from 'react';
import './App.css';
import TwitterCard from './components/TwitterCard';
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
import { IdentityProvider } from './context/IdentityContext';
import { useIdentity } from './context/IdentityContext';
import Dashboard from './components/Dashboard';

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
  const [reloadKissRanking, setReloadKissRanking] = useState(0);
  const [reloadKickRanking, setReloadKickRanking] = useState(0);

  const handleSetReloadKissRanking = () => {
    setReloadKissRanking(reloadKissRanking + 1);
  };

  const handleSetReloadKickRanking = () => {
    setReloadKickRanking(reloadKickRanking + 1);
  };

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
          <KissRanking reloadKissRanking={reloadKickRanking} />
          <TwitterCard
            handleSetReloadKissRanking={handleSetReloadKissRanking}
            handleSetReloadKickRanking={handleSetReloadKickRanking}
          />
          <KickRanking reloadKickRanking={reloadKickRanking} />
        </Content>
        {/* <Footer /> */}
      </Layout>
    </div>
  );
  return (
    <IdentityProvider>
      <Routes>
        <Route path='' element = {
          homePage
        }/>
        <Route path='dashboard' element = {
          <Dashboard/>
        }/>
        <Route path='*' element = {
          <NotFoundPage/>
        }/>
      </Routes>
    </IdentityProvider>
  )
}

export default App;
