import { Button, Result } from 'antd';
import Header from '../Header';
import { useNavigate } from 'react-router-dom'

const App: React.FC = () => {
  const navigate = useNavigate();

  const handleGoToHomePage = () => {
    navigate('/');
  };

  return (
    <>
      <Header/>
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={<Button type="primary" onClick={handleGoToHomePage}>Back Home</Button>}
      />
    </>
)};

export default App;