import { GameStartPage } from "@/components/game/GameStartPage";

type GamePageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function getFirstSearchParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value ?? null;
}

export default async function GamePage({ searchParams }: GamePageProps) {
  const params = (await searchParams) ?? {};
  const shouldOpenLoadPanel = getFirstSearchParam(params.panel) === "load";
  const initialLoadPanelTab =
    getFirstSearchParam(params.tab) === "cloud" ? "cloud" : "local";

  return (
    <GameStartPage
      initialLoadPanelOpen={shouldOpenLoadPanel}
      initialLoadPanelTab={initialLoadPanelTab}
      shouldClearLoadPanelParams={shouldOpenLoadPanel}
    />
  );
}
