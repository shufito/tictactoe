import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Separator } from "@/components/ui/separator";
import { useTicTacToe } from "@/logic/regraNegocios";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/laucher/withCpu")({
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
    bestMove,
    resetGame,
  } = useTicTacToe();

  const handleClick = (clickedIndex: number) => {
    if (winner || gameData[clickedIndex].playerID !== 0 || turn == 2) return;

    setGameData((prev) => {
      const playerMoves = prev.filter((value) => value.playerID === turn);
      let newGameData = [...prev];

      if (playerMoves.length > 2) {
        newGameData = newGameData.map((item) => {
          if (item.playerID === turn) {
            if (item.index === 1) return { playerID: 0, index: 0 };
            else if (item.index === 2) return { ...item, index: 1 };
            else if (item.index === 3) return { ...item, index: 2 };
          }
          return item;
        });
      }

      newGameData[clickedIndex] = {
        playerID: turn,
        index: playerMoves.length >= 3 ? 3 : playerMoves.length + 1,
      };

      checkWinner(newGameData);

      return newGameData;
    });

    setTurn(2);
  };

  const makeAIMove = () => {
    if (winner) return; // ✅ Se já há um vencedor, a IA não joga

    setGameData((prev) => {
      const availableMoves = prev
        .map((item, index) => (item.playerID === 0 ? index : null))
        .filter((index) => index !== null);

      if (availableMoves.length === 0) return prev;

      // const randomIndex =
      //   availableMoves[Math.floor(Math.random() * availableMoves.length)];
      const randomIndex = bestMove(prev, 2);
      const playerMoves = prev.filter((value) => value.playerID === 2);
      let newGameData = [...prev];

      if (playerMoves.length > 2) {
        newGameData = newGameData.map((item) => {
          if (item.playerID === 2) {
            if (item.index === 1) return { playerID: 0, index: 0 };
            else if (item.index === 2) return { ...item, index: 1 };
            else if (item.index === 3) return { ...item, index: 2 };
          }
          return item;
        });
      }

      if (randomIndex !== null) {
        newGameData[randomIndex] = {
          playerID: 2,
          index: playerMoves.length >= 3 ? 3 : playerMoves.length + 1,
        };
      }

      checkWinner(newGameData);

      return newGameData;
    });

    setTurn(1); // Retorna o turno para o jogador
  };

  useEffect(() => {
    if (!checkWinner(gameData)) {
      if (turn === 2 && !winner) {
        setTimeout(() => {
          makeAIMove();
        }, 700);
      }
    }
  }, [turn, winner]);

  // const [selectedModeGame, setSelectedModeGame] = useState("classico");
  // const [selectedDificult, setSelectedDificult] = useState("facil");

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className={"flex flex-col gap-6"}>
          {/* <Card>
            <CardContent className="pt-6">
              <form>
                <div className="grid gap-6">
                  <RadioGroup
                    className="grid grid-cols-2 gap-6"
                    value={selectedModeGame}
                    onValueChange={setSelectedModeGame}
                  >
                    {["classico", "competitivo"].map((level) => (
                      <div key={level} className="w-full">
                        <RadioGroupItem
                          value={level}
                          id={level}
                          className="hidden"
                        />
                        <Button
                          asChild
                          className="w-full"
                          variant={
                            selectedModeGame === level ? "secondary" : "outline"
                          }
                        >
                          <Label htmlFor={level}>
                            {level.charAt(0).toUpperCase() + level.slice(1)}
                          </Label>
                        </Button>
                      </div>
                    ))}
                  </RadioGroup>
                  <Separator />
                  <RadioGroup
                    className="grid grid-cols-3 gap-6"
                    value={selectedDificult}
                    onValueChange={setSelectedDificult}
                  >
                    {["facil", "medio", "dificil"].map((level) => (
                      <div key={level} className="w-full">
                        <RadioGroupItem
                          value={level}
                          id={level}
                          className="hidden"
                        />
                        <Button
                          asChild
                          className="w-full"
                          variant={
                            selectedDificult === level ? "secondary" : "outline"
                          }
                        >
                          <Label htmlFor={level}>
                            {level.charAt(0).toUpperCase() + level.slice(1)}
                          </Label>
                        </Button>
                      </div>
                    ))}
                  </RadioGroup>
                  <Separator />
                  <Button>Jogar</Button>
                </div>
              </form>
            </CardContent>
          </Card> */}
          {winner && (
            <h3 className="text-4xl text-center font-bold text-green-400">
              🎉 {winner} venceu!
            </h3>
          )}
          {!winner && (
            <h3 className="text-4xl text-center font-bold text-green-400">
              Turno de {turn == 1 ? "🍔" : "🦆"}
            </h3>
          )}
          <div className="grid grid-cols-3 gap-2 ">
            {gameData.map((e, index) => (
              <div
                key={index}
                onClick={() => {
                  handleClick(index);
                }}
                className={`border border-white h-24 rounded-sm bg-slate-950 flex justify-center items-center text-4xl ${winner && winningCombo?.includes(index) && "bg-white"} ${!winner && e.playerID == 1 && gameData.filter((value) => value.playerID === turn).length == 3 && e.index == 1 && "opacity-50"}`}
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
