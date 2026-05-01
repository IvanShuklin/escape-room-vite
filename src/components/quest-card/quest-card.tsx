import { generatePath, Link } from 'react-router-dom';
import { QuestPreview } from '../../types/api';
import { AppRoute } from '../../types/app-route';

type QuestCardProps = {
  quest: QuestPreview;
};

const QuestLevelTitle = {
  easy: 'легкий',
  medium: 'средний',
  hard: 'сложный',
} as const;

export default function QuestCard({ quest }: QuestCardProps) {
  const [peopleMin, peopleMax] = quest.peopleMinMax;

  return (
    <article>
      <Link to={generatePath(AppRoute.Quest, { questId: quest.id })}>
        <picture>
          <source srcSet={quest.previewImgWebp} type="image/webp" />
          <img
            src={quest.previewImg}
            width="344"
            height="232"
            alt={`Квест ${quest.title}`}
          />
        </picture>

        <h3>{quest.title}</h3>

        <p>
          {peopleMin === peopleMax
            ? `${peopleMin} чел.`
            : `${peopleMin}–${peopleMax} чел.`}
        </p>

        <p>{QuestLevelTitle[quest.level]}</p>
      </Link>
    </article>
  );
}
