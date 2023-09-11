import React from 'react';
import { Button, Layout } from 'antd';
import { WalletOutlined, AreaChartOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom'

const { Header, Content, Footer } = Layout;

const headerStyle: React.CSSProperties = {
    color: 'white',
    fontSize: '30px',
    backgroundColor: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
}

const App: React.FC = () => {
    const navigate = useNavigate();
  
    const handleGoToHomePage = () => {
        navigate('/');
      };

    const handleGoToRankingPage = () => {
      navigate('/ranking');
    };
    
    return(
        <Header style={headerStyle}>
            <div style={{display: 'flex',}}>
            <div onClick={handleGoToHomePage} style={{
                color: 'black'
            }}>KISS OR KICK</div>
            {/* <div 
                style={{
                    marginLeft: '50px',
                    color: 'black',
                }}
                onClick={handleGoToRankingPage}
            >
                <AreaChartOutlined />
                Ranking
            </div> */}
            </div>
            <Button type="primary" shape="round" style={{
                backgroundColor: 'black',
            }}icon={<WalletOutlined />} >
            Connect Wallet
            </Button>
      </Header>
    )
};

export default App;