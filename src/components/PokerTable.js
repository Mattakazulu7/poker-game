import React, { useState, useEffect } from 'react';
import Player from './Player';
import Dealer from './Dealer';

const PokerTable = () => {
  const initialPlayers = [
    { id: 1, name: 'Player 1', seated: false, cards: [], chips: 1000, bet: 0, isTurn: false },
    { id: 2, name: 'Player 2', seated: false, cards: [], chips: 1000, bet: 0, isTurn: false },
    { id: 3, name: 'Player 3', seated: false, cards: [], chips: 1000, bet: 0, isTurn: false },
    { id: 4, name: 'Player 4', seated: false, cards: [], chips: 1000, bet: 0, isTurn: false },
    { id: 5, name: 'Player 5', seated: false, cards: [], chips: 1000, bet: 0, isTurn: false },
    { id: 6, name: 'Player 6', seated: false, cards: [], chips: 1000, bet: 0, isTurn: false },
  ];

  const [players, setPlayers] = useState(initialPlayers);
  const [deck, setDeck] = useState(createDeck());
  const [communityCards, setCommunityCards] = useState([]);
  const [pot, setPot] = useState(0);
  const [currentBet, setCurrentBet] = useState(0);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [stage, setStage] = useState('pre-flop'); // pre-flop, flop, turn, river, showdown

  useEffect(() => {
    if (currentPlayer === null) {
      // Start with the player to the left of the dealer
      const nextPlayer = players.find(player => player.seated);
      if (nextPlayer) setCurrentPlayer(nextPlayer.id);
    }
  }, [currentPlayer, players]);

  const sitPlayer = (id) => {
    setPlayers(players.map(player => 
      player.id === id ? { ...player, seated: true } : player
    ));
  };

  const leavePlayer = (id) => {
    setPlayers(players.map(player => 
      player.id === id ? { ...player, seated: false, cards: [], bet: 0 } : player
    ));
  };

  function createDeck() {
    const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const newDeck = [];
    for (let suit of suits) {
      for (let value of values) {
        newDeck.push({ suit, value });
      }
    }
    return newDeck.sort(() => Math.random() - 0.5);
  }

  const dealCards = () => {
    const newDeck = [...deck];
    const updatedPlayers = players.map(player => {
      if (player.seated) {
        const playerCards = [newDeck.pop(), newDeck.pop()];
        return { ...player, cards: playerCards };
      }
      return player;
    });
    setDeck(newDeck);
    setPlayers(updatedPlayers);
    setStage('flop');
  };

  const dealCommunityCards = (number) => {
    const newDeck = [...deck];
    const newCommunityCards = [...communityCards];
    for (let i = 0; i < number; i++) {
      newCommunityCards.push(newDeck.pop());
    }
    setDeck(newDeck);
    setCommunityCards(newCommunityCards);

    if (number === 3) {
      setStage('turn');
    } else if (number === 1) {
      setStage(stage === 'turn' ? 'river' : 'showdown');
    }
  };

  const handleBet = (playerId, amount) => {
    const updatedPlayers = players.map(player => {
      if (player.id === playerId) {
        return { ...player, chips: player.chips - amount, bet: player.bet + amount };
      }
      return player;
    });
    setPlayers(updatedPlayers);
    setPot(pot + amount);
    setCurrentBet(currentBet + amount);
    moveToNextPlayer();
  };

  const moveToNextPlayer = () => {
    const currentPlayerIndex = players.findIndex(player => player.id === currentPlayer);
    let nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
    while (!players[nextPlayerIndex].seated) {
      nextPlayerIndex = (nextPlayerIndex + 1) % players.length;
    }
    setCurrentPlayer(players[nextPlayerIndex].id);
  };

  return (
    <div className="table">
      <Dealer communityCards={communityCards} />
      {players.map(player => (
        <Player 
          key={player.id} 
          player={player} 
          sitPlayer={sitPlayer} 
          leavePlayer={leavePlayer} 
          handleBet={handleBet} 
          isCurrent={player.id === currentPlayer}
        />
      ))}
      <button onClick={dealCards} disabled={stage !== 'pre-flop'}>Deal Hole Cards</button>
      <button onClick={() => dealCommunityCards(3)} disabled={stage !== 'flop'}>Deal Flop</button>
      <button onClick={() => dealCommunityCards(1)} disabled={stage !== 'turn'}>Deal Turn</button>
      <button onClick={() => dealCommunityCards(1)} disabled={stage !== 'river'}>Deal River</button>
    </div>
  );
};

export default PokerTable;

