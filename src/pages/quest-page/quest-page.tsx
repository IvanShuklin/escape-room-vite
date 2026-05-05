import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';

import QuestInfo from '../../components/quest-info/quest-info';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { clearQuest, loadQuest } from '../../store/quest/quest-slice';
import {
  getQuest,
  getQuestErrorType,
  getQuestLoadingStatus,
} from '../../store/quest/selectors';
import { AppRoute } from '../../types/app-route';
import NotFoundPage from '../not-found-page/not-found-page';

export default function QuestPage() {
  const { questId } = useParams();

  const dispatch = useAppDispatch();

  const quest = useAppSelector(getQuest);
  const loadingStatus = useAppSelector(getQuestLoadingStatus);
  const errorType = useAppSelector(getQuestErrorType);

  useEffect(() => {
    if (questId) {
      dispatch(loadQuest(questId));
    }

    return () => {
      dispatch(clearQuest());
    };
  }, [dispatch, questId]);

  if (!questId || errorType === 'not-found') {
    return <NotFoundPage />;
  }

  return (
    <>
      <Helmet>
        <title>
          {quest ? `${quest.title} — Escape Room` : 'Квест — Escape Room'}
        </title>
      </Helmet>

      <main className="decorated-page quest-page">
        {loadingStatus === 'loading' && (
          <div className="container container--size-l">
            <p>Загружаем квест...</p>
          </div>
        )}

        {loadingStatus === 'error' && errorType === 'common' && (
          <div className="container container--size-l">
            <p>Не удалось загрузить информацию о квесте.</p>
            <Link className="link" to={AppRoute.Root}>
              Вернуться на главную
            </Link>
          </div>
        )}

        {loadingStatus === 'success' && quest && <QuestInfo quest={quest} />}
      </main>
    </>
  );
}
