import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/laucher/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className={"flex flex-col gap-6"}>
          <Card>
            <CardContent className="pt-6">
              <form>
                <div className="grid gap-6">
                  <div className="grid gap-6">
                    <Link to="/laucher/withCpu">
                      <Button className="w-full">Jogar contra CPU</Button>
                    </Link>
                    <Link to="/laucher/withPlayer">
                      <Button className="w-full">Jogar com amigo</Button>
                    </Link>
                    <Link to="/laucher/withOnline">
                      <Button className="w-full">Jogar online</Button>
                    </Link>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
