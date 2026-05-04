import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

import QuestFilter from '../../components/quest-filter/quest-filter';
import QuestList from '../../components/quest-list/quest-list';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { changeQuestType, loadQuests } from '../../store/quests/quests-slice';
import {
  getActiveQuestType,
  getFilteredQuests,
  getQuestsLoadingStatus,
} from '../../store/quests/selectors';
import { QuestType } from '../../types/api';

export default function MainPage() {
  const dispatch = useAppDispatch();

  const quests = useAppSelector(getFilteredQuests);
  const activeType = useAppSelector(getActiveQuestType);
  const loadingStatus = useAppSelector(getQuestsLoadingStatus);

  useEffect(() => {
    dispatch(loadQuests());
  }, [dispatch]);

  const handleTypeChange = (type: QuestType | 'all') => {
    dispatch(changeQuestType(type));
  };

  return (
    <>
      <Helmet>
        <title>Escape Room — квесты в Санкт-Петербурге</title>
      </Helmet>

      <main className="page-content">
        <div className="container">
          <h1 className="subtitle page-content__subtitle">
            квесты в Санкт-Петербурге
          </h1>
          <h2 className="title title--size-m page-content__title">
            Выберите тематику
          </h2>

          <QuestFilter
            activeType={activeType}
            onTypeChange={handleTypeChange}
          />
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
