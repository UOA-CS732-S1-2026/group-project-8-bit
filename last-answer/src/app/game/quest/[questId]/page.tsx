type QuestPageProps = {
  params: Promise<{
    questId: string;
  }>;
};

export default async function QuestPage({ params }: QuestPageProps) {
  const { questId } = await params;

  return <main>Quest Page: {questId}</main>;
}
