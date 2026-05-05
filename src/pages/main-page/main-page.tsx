import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

import QuestFilter from '../../components/quest-filter/quest-filter';
import QuestList from '../../components/quest-list/quest-list';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  changeQuestLevel,
  changeQuestType,
  loadQuests,
} from '../../store/quests/quests-slice';
import {
  getActiveQuestLevel,
  getActiveQuestType,
  getFilteredQuests,
  getQuestsLoadingStatus,
} from '../../store/quests/selectors';
import { QuestLevel, QuestType } from '../../types/api';

export default function MainPage() {
  const dispatch = useAppDispatch();

  const quests = useAppSelector(getFilteredQuests);
  const activeType = useAppSelector(getActiveQuestType);
  const activeLevel = useAppSelector(getActiveQuestLevel);
  const loadingStatus = useAppSelector(getQuestsLoadingStatus);

  useEffect(() => {
    dispatch(loadQuests());
  }, [dispatch]);

  const handleTypeChange = (type: QuestType | 'all') => {
    dispatch(changeQuestType(type));
  };

  const handleLevelChange = (level: QuestLevel | 'any') => {
    dispatch(changeQuestLevel(level));
  };

  return (
    <>
      <Helmet>
        <title>Escape Room — квесты в Санкт-Петербурге</title>
      </Helmet>

      <main className="page-content">
        <div className="container">
          <div className="page-content__title-wrapper">
            <h1 className="subtitle page-content__subtitle">
              квесты в Санкт-Петербурге
            </h1>
            <h2 className="title title--size-m page-content__title">
              Выберите тематику
            </h2>
          </div>

          <div className="page-content__item">
            <QuestFilter
              activeType={activeType}
              activeLevel={activeLevel}
              onTypeChange={handleTypeChange}
              onLevelChange={handleLevelChange}
            />
          </div>

          <h2 className="title visually-hidden">Выберите квест</h2>

          {loadingStatus === 'loading' && <p>Загружаем квесты...</p>}

          {loadingStatus === 'error' && (
            <p>Не удалось загрузить квесты. Попробуйте обновить страницу.</p>
          )}

          {loadingStatus === 'success' && <QuestList quests={quests} />}
        </div>
      </main>
    </>
  );
}
