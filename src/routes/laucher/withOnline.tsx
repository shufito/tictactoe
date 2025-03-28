import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io(
  "https://70fad665-8330-4e9e-9279-93ad5c090e1a-00-3va5oybqxbu8w.spock.replit.dev/"
);

export const Route = createFileRoute("/laucher/withOnline")({
  component: RouteComponent,
});

function RouteComponent() {
  const [roomName, setRoomName] = useState("");
  const [player, setPlayer] = useState(null);
  const [board, setBoard] = useState(Array(9).fill(""));
  const [status, setStatus] = useState("Aguardando jogadores...");
  const [inGame, setInGame] = useState(false);

  useEffect(() => {
    socket.on("roomCreated", (room) => {
      setRoomName(room);
      setStatus(`Você criou a sala ${room}. Aguarde o outro jogador.`);
    });

    socket.on("roomJoined", (room) => {
      setRoomName(room);
      setStatus(`Você entrou na sala ${room}. Aguardando o outro jogador.`);
    });

    socket.on("player", (assignedPlayer) => {
      setPlayer(assignedPlayer);
      setStatus(`Você é o jogador ${assignedPlayer}`);
    });

    socket.on("start", () => {
      setInGame(true);
      setStatus(`Sua vez, jogador ${player}!`);
    });

    socket.on("update", ({ board, currentPlayer }) => {
      setBoard(board);
      setStatus(`Vez do jogador ${currentPlayer}`);
    });

    socket.on("winner", (winner) => {
      if (winner === "Draw") {
        setStatus("Empate!");
      } else {
        setStatus(`Jogador ${winner} venceu!`);
      }
    });

    socket.on("error", (message) => {
      setStatus(message);
    });

    return () => {
      socket.off("roomCreated");
      socket.off("roomJoined");
      socket.off("player");
      socket.off("start");
      socket.off("update");
      socket.off("winner");
      socket.off("error");
    };
  }, [player]);

  const createRoom = () => {
    const room = prompt("Digite o nome da sala:");
    if (room) socket.emit("createRoom", room);
  };

  const joinRoom = () => {
    if (roomName.trim()) socket.emit("joinRoom", roomName);
  };

  const handleMove = (index: number) => {
    if (board[index] === "") {
      console.log("dentro");
      socket.emit("move", roomName, { index, player });
    }
  };

  return (
    <div className="container">
      {!inGame ? (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
          <div className="flex w-full max-w-sm flex-col gap-6">
            <div className={"flex flex-col gap-6"}>
              <Card>
                <CardContent className="pt-6">
                  <form>
                    <div className="grid gap-6">
                      <div className="grid gap-6">
                        <Button
                          className="w-full"
                          onClick={createRoom}
                          type="button"
                        >
                          Criar sala
                        </Button>
                        <div className="grid grid-cols-3 gap-2">
                          <Input
                            id="nome"
                            type="text"
                            placeholder="Digite o código da sala"
                            className="col-span-2"
                            value={roomName}
                            onChange={(e) => setRoomName(e.target.value)}
                          />
                          <Button
                            className="w-full"
                            onClick={joinRoom}
                            type="button"
                          >
                            Entrar na Sala
                          </Button>
                        </div>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
              {status}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
          <div className="flex w-full max-w-sm flex-col gap-6">
            <div className={"flex flex-col gap-6"}>
              <h3 className="text-4xl text-center font-bold text-green-400">
                {status}
              </h3>
              <div className="grid grid-cols-3 gap-2 ">
                {board.map((cell, index) => (
                  <div
                    key={index}
                    onClick={() => handleMove(index)}
                    className={`border text-white border-white h-24 rounded-sm bg-slate-950 flex justify-center items-center text-4xl`}
                  >
                    {cell}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
