import React, { useEffect, useState } from 'react';
import './App.css';

const winningCombinations = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
]

function App() {
  const [gameData, setGameData] = useState([0,0,0,0,0,0,0,0,0]);
  const [turn, setTurn] = useState(1);
  const [winningCombo, setWinningCombo] = useState(null);

  const handleClick = (clickedIndex) =>{
    //marcar apenas uma vez
    if (gameData[clickedIndex] !== 0){
      return;
    }

    //para o jogo caso haja um vencedor
    if(winningCombo){
      return;
    }

    //adiciona X e O
    setGameData((prev) =>{
      const newGameData = [...prev];
      newGameData[clickedIndex] = turn;
      return newGameData;
    });

    //troca o turno dos jogadores
    setTurn((prev) => (prev == 1?2:1));

  };
  
  useEffect(() =>{
    checkGameEnded();
    checkWinner(); 
  },[gameData]);

  const checkGameEnded = () => {
    if (gameData.every((item) => item !== 0)) {
      
    }
  };

  useEffect(() => {
    if (winningCombo) {
      
    }
  }, [winningCombo]);

  const checkWinner = () =>{
    let winner = null;
    for(let values of winningCombinations){
    
      if(
        gameData[values[0]]=== 1 && 
        gameData[values[1]]=== 1 && 
        gameData[values[2]]=== 1){
        winner="x";
      }
      if(
        gameData[values[0]]=== 2 && 
        gameData[values[1]]=== 2 && 
        gameData[values[2]]=== 2){
        winner="0";
      }
      if (winner) {
        setWinningCombo(values);
        break;
      }
    }
    console.log({winner});
  };

  return (
    <>
      <div>
        <h2 className='turn'>Vez de {turn == 1 ?"X":"O"} jogar!!!
        </h2>
      </div>
      <div className={ turn==1 ? "boardx board-game":"boardO board-game"}>
        {gameData.map((valeu, index)=> (
        <span key = {index} 
        onClick={() => {handleClick(index)}}
        className={(index)=>{winningCombo?.includes(index)? "winner":undefined, index== 1? "x":"o"}}>
          {valeu == 1 && "❌"}
          {valeu == 2 && "⭕️"}
        </span>
        ))}
      </div>
    </>
  );
}

export default App;
