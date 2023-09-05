import React from 'react';

interface KissFaceButtonProps {
  onKissFace: () => void;
}

const KissFaceButton: React.FC<KissFaceButtonProps> = ({ onKissFace }) => {
  return (
    <button onClick={onKissFace} className="kiss-face-button">
      Kiss Face
    </button>
  );
};

export default KissFaceButton;
