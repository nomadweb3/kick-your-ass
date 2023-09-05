import React from 'react';
import './index.css';

interface TwitterCardProps {
  handle: string;
  avatarUrl: string;
  kickCount: number;
  kissCount: number;
}

const TwitterCard: React.FC<TwitterCardProps> = ({
  handle,
  avatarUrl,
  kickCount,
  kissCount,
}) => {
  const onKickAss = async () => {

  }

  const onKissFace = async () => {

  }
  
  return (
    <div className="twitter-card">
      <img className='avatar' src={avatarUrl} alt={`${handle}'s avatar`} />
      {/* <h3>{handle}</h3> */}
      <div className="actions">
        <button onClick={onKickAss}>Kick Ass</button>
        <button onClick={onKissFace}>Kiss Face</button>
      </div>
      <div className="stats">
        <p>Kick Count: {kickCount}</p>
        <p>Kiss Count: {kissCount}</p>
      </div>
    </div>
  );
};

export default TwitterCard;
