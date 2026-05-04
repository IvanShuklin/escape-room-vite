import { QuestType } from '../../types/api';

type QuestFilterItem = {
  type: QuestType | 'all';
  title: string;
};

const QuestFilterItems: QuestFilterItem[] = [
  { type: 'all', title: 'Все квесты' },
  { type: 'adventures', title: 'Приключения' },
  { type: 'horror', title: 'Ужасы' },
  { type: 'mystic', title: 'Мистика' },
  { type: 'detective', title: 'Детектив' },
  { type: 'sci-fi', title: 'Sci-fi' },
];

type QuestFilterProps = {
  activeType: QuestType | 'all';
  onTypeChange: (type: QuestType | 'all') => void;
};

export default function QuestFilter({
  activeType,
  onTypeChange,
}: QuestFilterProps) {
  return (
    <div className="page-content__item">
      <ul className="filter__list">
        {QuestFilterItems.map((item) => (
          <li className="filter__item" key={item.type}>
            <button
              type="button"
              onClick={() => onTypeChange(item.type)}
              aria-pressed={activeType === item.type}
            >
              {item.title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
