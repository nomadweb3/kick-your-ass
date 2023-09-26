import React, { useState } from 'react';
import { Button, Layout, Drawer } from 'antd';
import { WalletOutlined, InfoCircleFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom'
import { AuthClient  } from '@dfinity/auth-client';
import { useIdentity } from '../../context/IdentityContext';
import { Modal } from '@douyinfe/semi-ui';
import LogoICSVG from '../../assets/logoIC.svg';
import LogoNFIDPNG from '../../assets/logoNFID.png';

const { Header } = Layout;
interface HeaderProps {

}

const App: React.FC<HeaderProps> = () => {
    const navigate = useNavigate();
    const { identity, setIdentity } = useIdentity();
    const [isLogin, setIsLogin] = useState(false);
    const [open, setOpen] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const showDrawer = () => {
      setOpen(true);
    };
  
    const onClose = () => {
      setOpen(false);
    };

    const handleGoToHomePage = () => {
        navigate('/');
    };

    const handleGoToDashBoardPage = () => {
        navigate('/dashboard');
    };

    const handleClick = () => {
        setModalVisible(true);
    };
    
    const handleOk = () => {
        setModalVisible(false);
    };

    const handleAuthenticated = (authClient: AuthClient) => {
        // console.log('Already Logined');
        const identity = authClient.getIdentity();
        setIdentity(identity);
        // console.log('principal : ', identity.getPrincipal().toString());
        setIsLogin(true);
    };

    const handleIILogin = async() => {
        const authClient = await AuthClient.create();

        if(await authClient.isAuthenticated()) {
            handleAuthenticated(authClient);
            return;
        };
        
        await new Promise<void>((resolve, reject) => {
            authClient.login({
                onSuccess: resolve,
                onError: reject,
            });
        }).then(() => {
            // console.log('use II Login');
            const identity = authClient.getIdentity();
            setIdentity(identity);
            // console.log('principal : ', identity.getPrincipal().toString());
            setIsLogin(true);
        });
    };

    const handleNFIDLogin = async () => {
        const authClient = await AuthClient.create();

        if(await authClient.isAuthenticated()) {
            handleAuthenticated(authClient);
            return;
        };

        const APPLICATION_NAME = "kissORkick";
        const APPLICATION_LOGO_URL = "https://kh4t2-waaaa-aaaal-qbhbq-cai.raw.ic0.app/file/c4LHgkmhwQ3O6mhJ9ZB2M";
        const AUTH_PATH = "/authenticate/?applicationName="+APPLICATION_NAME+"&applicationLogo="+APPLICATION_LOGO_URL+"#authorize";
        const NFID_AUTH_URL = "https://nfid.one" + AUTH_PATH;
        
        await new Promise<void>((resolve, reject) => {
            authClient.login({
                identityProvider: NFID_AUTH_URL,
                onSuccess: resolve,
                onError: reject,
                windowOpenerFeatures:
                    `left=${window.screen.width / 2 - 525 / 2}, `+
                    `top=${window.screen.height / 2 - 705 / 2},` +
                    `toolbar=0,location=0,menubar=0,width=525,height=705`,
            });
        }).then(() => {
            console.log('use NFID Login');
            const identity = authClient.getIdentity();
            setIdentity(identity);
            console.log('principal : ', identity.getPrincipal().toString());
            setIsLogin(true);
        });
    };

    return(
        <Header style={{
            color: 'white',
            fontSize: '30px',
            backgroundColor: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
        }}>
            <div style={{
                display: 'flex',
                gap: '50px',
            }}>
                <div onClick={handleGoToHomePage} style={{
                    color: 'black'
                }}>
                    KISS OR KICK
                </div>

                <div onClick={handleGoToDashBoardPage} style={{
                    color: 'black'
                }}>
                    DashBoard
                </div>
            </div>

            {(!isLogin) && (
                <div>
                <Button 
                    type="primary" 
                    shape="round" 
                    style={{backgroundColor: 'black',}}
                    icon={<WalletOutlined />} 
                    onClick={handleClick} >
                    Connect Wallet
                </Button>
                <Modal
                    title="Connect Web3 Identity"
                    visible={modalVisible}
                    onOk={handleOk}
                    hasCancel={false}
                    okType='tertiary'
                    okText='Close'
                    closable={false}
                >
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '80px',
                        paddingTop: '20px',
                    }}>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                        }} onClick={handleIILogin}>
                            <img src={LogoICSVG} style={{
                            }}/>
                            <p>Internet Identity</p>
                        </div>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }} onClick={handleNFIDLogin}>
                            <img src={LogoNFIDPNG} style={{
                                width: '102px',
                            }}/>
                            <p>NFID</p>
                        </div>
                    </div>

                </Modal>
            </div>
                )
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