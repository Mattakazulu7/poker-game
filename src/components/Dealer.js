import React from 'react';

const Dealer = ({ communityCards }) => {
  return (
    <div className="dealer" id="dealer">
      Dealer
      <div>Community Cards: {communityCards.map(card => `${card.value} of ${card.suit}`).join(', ')}</div>
    </div>
  );
};

export default Dealer;

