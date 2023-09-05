import React from 'react';

interface RankingTabProps {
    name: string;
    rankingData: Array<[string, bigint]>; // 新的接口数据类型
}

const RankingTab: React.FC<RankingTabProps> = ({ name, rankingData }) => {
  return (
    <div className="ranking-tab">
      <h2>{name}</h2>
      <ol>
        {rankingData.map(([handle, kickCount], index) => (
          <li key={index}>
            {handle}: {kickCount.toString()} {/* 使用 .toString() 将 bigint 转换为字符串 */}
          </li>
        ))}
      </ol>
    </div>
  );
};

export default RankingTab;
