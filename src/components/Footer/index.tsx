import React from 'react';
import { Layout } from 'antd';
import onChainPng from '../../assets/onChain.png';

const { Footer } = Layout;

const footerStyle: React.CSSProperties = {
    backgroundColor: 'white',
};

const App: React.FC = () => {
    return(
        <Footer style={footerStyle}>
          <img src={onChainPng} style={{
            maxWidth: '100%',
            maxHeight: '100%',
            width: '300px',
            height: 'auto',
          }}/>
        </Footer>
    )
};

export default App;