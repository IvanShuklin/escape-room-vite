import { generatePath, Link } from 'react-router-dom';

import { AppRoute } from '../../types/app-route';
import { QuestPreview } from '../../types/api';
import { QuestLevelTitle } from '../../const';

type QuestCardProps = {
  quest: QuestPreview;
};

export default function QuestCard({ quest }: QuestCardProps) {
  const [peopleMin, peopleMax] = quest.peopleMinMax;

  const questLink = generatePath(AppRoute.Quest, { questId: quest.id });
  const peopleCount =
    peopleMin === peopleMax
      ? `${peopleMin}\u00A0чел`
      : `${peopleMin}–${peopleMax}\u00A0чел`;

  return (
    <div className="quest-card">
      <div className="quest-card__img">
        <picture>
          <source srcSet={quest.previewImgWebp} type="image/webp" />
          <img
            src={quest.previewImg}
            width="344"
            height="232"
            alt={`Квест ${quest.title}`}
          />
        </picture>
      </div>

      <div className="quest-card__content">
        <div className="quest-card__info-wrapper">
          <Link className="quest-card__link" to={questLink}>
            {quest.title}
          </Link>
        </div>

        <ul className="tags quest-card__tags">
          <li className="tags__item">
            <svg width="11" height="14" aria-hidden="true">
              <use xlinkHref="#icon-person"></use>
            </svg>
            {peopleCount}
          </li>
          <li className="tags__item">
            <svg width="14" height="14" aria-hidden="true">
              <use xlinkHref="#icon-level"></use>
            </svg>
            {QuestLevelTitle[quest.level]}
          </li>
        </ul>
      </div>
    </div>
  );
}
