import React, { useState } from 'react';
import { Button, Layout, Drawer } from 'antd';
import { WalletOutlined, InfoCircleFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom'
import { AuthClient  } from '@dfinity/auth-client';
import { HttpAgent, Actor, Identity } from '@dfinity/agent';
import { idlFactory as backendIDL } from '../../dids/backend.did';
import { useIdentity } from '../../context/IdentityContext';

const { Header, Content, Footer } = Layout;

const headerStyle: React.CSSProperties = {
    color: 'white',
    fontSize: '30px',
    backgroundColor: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
}
interface HeaderProps {

}

const App: React.FC<HeaderProps> = () => {
    const navigate = useNavigate();
    const { identity, setIdentity } = useIdentity();
    const [isLogin, setIsLogin] = useState(false);
    const [open, setOpen] = useState(false);

    const showDrawer = () => {
      setOpen(true);
    };
  
    const onClose = () => {
      setOpen(false);
    };

    const handleGoToHomePage = () => {
        navigate('/');
    };

    const handleGoToRankingPage = () => {
      navigate('/ranking');
    };

    const handleLogin = async() => {
        
        const authClient = await AuthClient.create();

        await new Promise<void>((resolve, reject) => {
            authClient.login({
                onSuccess: resolve,
                onError: reject,
            });
        }).then(() => {
            const identity = authClient.getIdentity();
            setIdentity(identity);
            console.log('principal : ', identity.getPrincipal().toString());
            setIsLogin(true);
        });
    };

    return(
        <Header style={headerStyle}>
            <div style={{display: 'flex',}}>
            <div onClick={handleGoToHomePage} style={{
                color: 'black'
            }}>KISS OR KICK</div>
            </div>
            {(!isLogin) && 
                (<Button 
                    type="primary" 
                    shape="round" 
                    style={{backgroundColor: 'black',}}
                    icon={<WalletOutlined />} 
                    onClick={handleLogin} >
                    Connect Wallet
                </Button>)
            }
            {isLogin && 
                (<Button 
                    type="primary" 
                    shape="round" 
                    style={{backgroundColor: 'black',}}
                    icon={<WalletOutlined />} 
                    onClick={showDrawer} >
                    Wallet
                </Button>)
            }
            {/* <Button 
                    type="primary" 
                    shape="round" 
                    style={{backgroundColor: 'black',}}
                    icon={<WalletOutlined />} 
                    onClick={showDrawer} >
                    Wallet
                </Button> */}
            <Drawer title="User Info" placement="right" onClose={onClose} open={open}>
                <p>Address : </p>
                {identity?.getPrincipal().toString()}
                <p>Activity : </p>
                <p>Invitation : </p>
            </Drawer>
      </Header>
    )
};

export default App;