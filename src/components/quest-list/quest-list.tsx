import { QuestPreview } from '../../types/api';
import QuestCard from '../quest-card/quest-card';

type QuestListProps = {
  quests: QuestPreview[];
};

export default function QuestList({ quests }: QuestListProps) {
  if (quests.length === 0) {
    return <p>Квесты не найдены.</p>;
  }

  return (
    <div className="cards-grid">
      {quests.map((quest) => (
        <QuestCard key={quest.id} quest={quest} />
      ))}
    </div>
  );
}
