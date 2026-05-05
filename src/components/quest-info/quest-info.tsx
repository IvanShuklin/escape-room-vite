import { generatePath, Link } from 'react-router-dom';

import { AppRoute } from '../../types/app-route';
import { Quest, QuestLevel, QuestType } from '../../types/api';

type QuestInfoProps = {
  quest: Quest;
};

const QuestLevelTitle: Record<QuestLevel, string> = {
  easy: 'Лёгкий',
  medium: 'Средний',
  hard: 'Сложный',
};

const QuestTypeTitle: Record<QuestType, string> = {
  adventures: 'Приключения',
  horror: 'Ужасы',
  mystic: 'Мистика',
  detective: 'Детектив',
  'sci-fi': 'Sci-fi',
};

export default function QuestInfo({ quest }: QuestInfoProps) {
  const [peopleMin, peopleMax] = quest.peopleMinMax;

  const peopleCount =
    peopleMin === peopleMax
      ? `${peopleMin}\u00A0чел`
      : `${peopleMin}–${peopleMax}\u00A0чел`;

  const bookingLink = generatePath(AppRoute.Booking, { questId: quest.id });

  return (
    <>
      <div className="decorated-page__decor" aria-hidden="true">
        <picture>
          <source type="image/webp" srcSet={quest.coverImgWebp} />
          <img src={quest.coverImg} width="1366" height="768" alt="" />
        </picture>
      </div>

      <div className="container container--size-l">
        <div className="quest-page__content">
          <h1 className="title title--size-l title--uppercase quest-page__title">
            {quest.title}
          </h1>

          <p className="subtitle quest-page__subtitle">
            <span className="visually-hidden">Жанр:</span>
            {QuestTypeTitle[quest.type]}
          </p>

          <ul className="tags tags--size-l quest-page__tags">
            <li className="tags__item">
              <svg width="11" height="14" aria-hidden="true">
                <use xlinkHref="#icon-person" />
              </svg>
              {peopleCount}
            </li>
            <li className="tags__item">
              <svg width="14" height="14" aria-hidden="true">
                <use xlinkHref="#icon-level" />
              </svg>
              {QuestLevelTitle[quest.level]}
            </li>
          </ul>

          <p className="quest-page__description">{quest.description}</p>

          <Link
            className="btn btn--accent btn--cta quest-page__btn"
            to={bookingLink}
          >
            Забронировать
          </Link>
        </div>
      </div>
    </>
  );
}
