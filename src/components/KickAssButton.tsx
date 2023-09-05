import React from 'react';

interface KickAssButtonProps {
  onKickAss: () => void;
}

const KickAssButton: React.FC<KickAssButtonProps> = ({ onKickAss }) => {
  return (
    <button onClick={onKickAss} className="kick-ass-button">
      Kick Ass
    </button>
  );
};

export default KickAssButton;
