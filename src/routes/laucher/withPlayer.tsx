import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
import { useTicTacToe } from "@/logic/regraNegocios";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/laucher/withPlayer")({
  component: RouteComponent,
});

function RouteComponent() {
  const {
    gameData,
    setGameData,
    turn,
    setTurn,
    winner,
    checkWinner,
    winningCombo,
    resetGame,
  } = useTicTacToe();

  const handleClick = (clickedIndex: number) => {
    if (winner || gameData[clickedIndex].playerID !== 0) return;
    setGameData((prev) => {
      // Filtra todas as jogadas do jogador atual
      const playerMoves = prev.filter((value) => value.playerID === turn);

      let newGameData = [...prev];

      if (playerMoves.length > 2) {
        newGameData = newGameData.map((item) => {
          if (item.playerID === turn) {
            if (item.index === 1) {
              return { playerID: 0, index: 0 }; // Libera a posição mais antiga
            } else if (item.index === 2) {
              return { ...item, index: 1 }; // Move o índice 2 para 1
            } else if (item.index === 3) {
              return { ...item, index: 2 }; // Move o índice 3 para 2
            }
          }
          return item;
        });
      }

      // Adiciona a nova jogada do jogador atual
      newGameData[clickedIndex] = {
        playerID: turn,
        index: playerMoves.length >= 3 ? 3 : playerMoves.length + 1,
      };

      checkWinner(newGameData);

      return newGameData;
    });

    // Alterna o turno após a jogada
    setTurn((prev) => (prev === 1 ? 2 : 1));
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className={"flex flex-col gap-6"}>
          {/* <Card>
                <CardContent className="pt-6">
                  <form>
                    <div className="grid gap-6">
                      <div className="grid grid-cols-2 gap-6">
                        <Button className="w-full">Classico</Button>
                        <Button className="w-full">Competitivo</Button>
                      </div>
                      <Separator />
                      <div className="grid grid-cols-3 gap-6">
                        <Button className="w-full">Facil</Button>
                        <Button className="w-full">Normal</Button>
                        <Button className="w-full">Dificil</Button>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card> */}
          {winner && (
            <h3 className="text-4xl text-center font-bold text-green-400">
              🎉 {winner} venceu!
            </h3>
          )}
          <div className="grid grid-cols-3 gap-2 ">
            {gameData.map((e, index) => (
              <div
                key={index}
                onClick={() => {
                  handleClick(index);
                }}
                className={`border border-white h-24 rounded-sm bg-slate-950 flex justify-center items-center text-4xl ${winner && winningCombo?.includes(index) && "bg-white"} ${!winner && e.playerID == turn && gameData.filter((value) => value.playerID === turn).length == 3 && e.index == 1 && "opacity-50"}`}
              >
                {e.playerID == 1 && "🍔"}
                {e.playerID == 2 && "🦆"}
                {/* {e.index} */}
              </div>
            ))}
          </div>
          {winner && <Button onClick={resetGame}>Novo Jogo</Button>}
        </div>
      </div>
    </div>
  );
}
