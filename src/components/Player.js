import React from 'react';

const Player = ({ player, sitPlayer, leavePlayer, handleBet, isCurrent }) => {
  const [betAmount, setBetAmount] = React.useState(0);

  const handleInputChange = (event) => {
    setBetAmount(Number(event.target.value));
  };

  return (
    <div className={`player ${player.seated ? 'seated' : ''} ${isCurrent ? 'current' : ''}`} id={`player${player.id}`}>
      {player.name} {isCurrent ? "(Your turn)" : ""}
      {player.seated ? (
        <>
          (Seated)
          <button onClick={() => leavePlayer(player.id)}>Leave</button>
          <div>Cards: {player.cards.map(card => `${card.value} of ${card.suit}`).join(', ')}</div>
          <div>Chips: {player.chips}</div>
          <div>
            <input type="number" value={betAmount} onChange={handleInputChange} />
            <button onClick={() => handleBet(player.id, betAmount)}>Bet</button>
          </div>
        </>
      ) : (
        <>
          <button onClick={() => sitPlayer(player.id)}>Sit</button>
          <button onClick={() => leavePlayer(player.id)}>Leave</button>
        </>
      )}
    </div>
  );
};

export default Player;

