import { QuestLevel, QuestType } from '../../types/api';

type QuestFilterTypeItem = {
  type: QuestType | 'all';
  id: string;
  title: string;
  icon: string;
  iconWidth: number;
};

type QuestFilterLevelItem = {
  level: QuestLevel | 'any';
  id: string;
  title: string;
};

const questFilterTypeItems: QuestFilterTypeItem[] = [
  {
    type: 'all',
    id: 'all',
    title: 'Все квесты',
    icon: '#icon-all-quests',
    iconWidth: 26,
  },
  {
    type: 'adventures',
    id: 'adventure',
    title: 'Приключения',
    icon: '#icon-adventure',
    iconWidth: 36,
  },
  {
    type: 'horror',
    id: 'horror',
    title: 'Ужасы',
    icon: '#icon-horror',
    iconWidth: 30,
  },
  {
    type: 'mystic',
    id: 'mystic',
    title: 'Мистика',
    icon: '#icon-mystic',
    iconWidth: 30,
  },
  {
    type: 'detective',
    id: 'detective',
    title: 'Детектив',
    icon: '#icon-detective',
    iconWidth: 40,
  },
  {
    type: 'sci-fi',
    id: 'sciFi',
    title: 'Sci-fi',
    icon: '#icon-sci-fi',
    iconWidth: 28,
  },
];

const questFilterLevelItems: QuestFilterLevelItem[] = [
  { level: 'any', id: 'any', title: 'Любой' },
  { level: 'easy', id: 'easy', title: 'Лёгкий' },
  { level: 'medium', id: 'middle', title: 'Средний' },
  { level: 'hard', id: 'hard', title: 'Сложный' },
];

type QuestFilterProps = {
  activeType: QuestType | 'all';
  activeLevel: QuestLevel | 'any';
  onTypeChange: (type: QuestType | 'all') => void;
  onLevelChange: (level: QuestLevel | 'any') => void;
};

export default function QuestFilter({
  activeType,
  activeLevel,
  onTypeChange,
  onLevelChange,
}: QuestFilterProps) {
  return (
    <form className="filter" action="#" method="get">
      <fieldset className="filter__section">
        <legend className="visually-hidden">Тематика</legend>
        <ul className="filter__list">
          {questFilterTypeItems.map((item) => (
            <li className="filter__item" key={item.type}>
              <input
                type="radio"
                name="type"
                id={item.id}
                checked={activeType === item.type}
                onChange={() => onTypeChange(item.type)}
              />
              <label className="filter__label" htmlFor={item.id}>
                <svg
                  className="filter__icon"
                  width={item.iconWidth}
                  height="30"
                  aria-hidden="true"
                >
                  <use xlinkHref={item.icon} />
                </svg>
                <span className="filter__label-text">{item.title}</span>
              </label>
            </li>
          ))}
        </ul>
      </fieldset>

      <fieldset className="filter__section">
        <legend className="visually-hidden">Сложность</legend>
        <ul className="filter__list">
          {questFilterLevelItems.map((item) => (
            <li className="filter__item" key={item.level}>
              <input
                type="radio"
                name="level"
                id={item.id}
                checked={activeLevel === item.level}
                onChange={() => onLevelChange(item.level)}
              />
              <label className="filter__label" htmlFor={item.id}>
                <span className="filter__label-text">{item.title}</span>
              </label>
            </li>
          ))}
        </ul>
      </fieldset>
    </form>
  );
}
