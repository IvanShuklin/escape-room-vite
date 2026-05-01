import { generatePath, Link } from 'react-router-dom';

import { AppRoute } from '../../types/app-route';
import { Quest, QuestLevel, QuestType } from '../../types/api';

type QuestInfoProps = {
  quest: Quest;
};

const QuestLevelTitle: Record<QuestLevel, string> = {
  easy: 'простой',
  medium: 'средний',
  hard: 'сложный',
};

const QuestTypeTitle: Record<QuestType, string> = {
  adventures: 'приключения',
  horror: 'ужасы',
  mystic: 'мистика',
  detective: 'детектив',
  'sci-fi': 'sci-fi',
};

export default function QuestInfo({ quest }: QuestInfoProps) {
  const [peopleMin, peopleMax] = quest.peopleMinMax;

  return (
    <section>
      <picture>
        <source srcSet={quest.coverImgWebp} type="image/webp" />
        <img src={quest.coverImg} alt={`Квест ${quest.title}`} />
      </picture>

      <div>
        <p>{QuestTypeTitle[quest.type]}</p>

        <h1>{quest.title}</h1>

        <ul>
          <li>
            {peopleMin === peopleMax
              ? `${peopleMin} чел.`
              : `${peopleMin}–${peopleMax} чел.`}
          </li>
          <li>{QuestLevelTitle[quest.level]}</li>
        </ul>

        <p>{quest.description}</p>

        <Link to={generatePath(AppRoute.Booking, { questId: quest.id })}>
          Забронировать
        </Link>
      </div>
    </section>
  );
}
