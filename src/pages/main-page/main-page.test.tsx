import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HelmetProvider } from 'react-helmet-async';
import { vi } from 'vitest';

import MainPage from './main-page';
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
import { QuestLevel, QuestPreview, QuestType } from '../../types/api';

const mocks = vi.hoisted(() => ({
  dispatch: vi.fn(),
}));

const filteredQuests: QuestPreview[] = [
  {
    id: 'quest-1',
    title: 'Маньяк',
    previewImg: 'img-1.jpg',
    previewImgWebp: 'img-1.webp',
    level: 'hard',
    type: 'horror',
    peopleMinMax: [2, 5],
  },
];

vi.mock('../../store/hooks', () => ({
  useAppDispatch: () => mocks.dispatch,
  useAppSelector: (selector: () => unknown) => selector(),
}));

vi.mock('../../store/quests/selectors', () => ({
  getFilteredQuests: vi.fn(),
  getActiveQuestType: vi.fn(),
  getActiveQuestLevel: vi.fn(),
  getQuestsLoadingStatus: vi.fn(),
}));

vi.mock('../../store/quests/quests-slice', () => ({
  loadQuests: vi.fn(() => ({ type: 'quests/loadQuests' })),
  changeQuestType: vi.fn((type: QuestType | 'all') => ({
    type: 'quests/changeQuestType',
    payload: type,
  })),
  changeQuestLevel: vi.fn((level: QuestLevel | 'any') => ({
    type: 'quests/changeQuestLevel',
    payload: level,
  })),
}));

vi.mock('../../components/quest-filter/quest-filter', () => ({
  default: ({
    activeType,
    activeLevel,
    onTypeChange,
    onLevelChange,
  }: {
    activeType: QuestType | 'all';
    activeLevel: QuestLevel | 'any';
    onTypeChange: (type: QuestType | 'all') => void;
    onLevelChange: (level: QuestLevel | 'any') => void;
  }) => (
    <div>
      <span>Активный тип: {activeType}</span>
      <span>Активная сложность: {activeLevel}</span>
      <button type="button" onClick={() => onTypeChange('horror')}>
        Выбрать ужасы
      </button>
      <button type="button" onClick={() => onLevelChange('hard')}>
        Выбрать сложный
      </button>
    </div>
  ),
}));

vi.mock('../../components/quest-list/quest-list', () => ({
  default: ({ quests }: { quests: QuestPreview[] }) => (
    <ul>
      {quests.map((quest) => (
        <li key={quest.id}>{quest.title}</li>
      ))}
    </ul>
  ),
}));

const renderMainPage = () =>
  render(
    <HelmetProvider>
      <MainPage />
    </HelmetProvider>,
  );

describe('Page: MainPage', () => {
  beforeEach(() => {
    mocks.dispatch.mockClear();

    vi.mocked(getFilteredQuests).mockReturnValue(filteredQuests);
    vi.mocked(getActiveQuestType).mockReturnValue('all');
    vi.mocked(getActiveQuestLevel).mockReturnValue('any');
    vi.mocked(getQuestsLoadingStatus).mockReturnValue('success');

    vi.mocked(loadQuests).mockClear();
    vi.mocked(changeQuestType).mockClear();
    vi.mocked(changeQuestLevel).mockClear();
  });

  it('should dispatch loadQuests on mount', () => {
    renderMainPage();

    expect(loadQuests).toHaveBeenCalledTimes(1);
    expect(mocks.dispatch).toHaveBeenCalledWith({ type: 'quests/loadQuests' });
  });

  it('should render loading message', () => {
    vi.mocked(getQuestsLoadingStatus).mockReturnValue('loading');

    renderMainPage();

    expect(screen.getByText('Загружаем квесты...')).toBeInTheDocument();
  });

  it('should render error message', () => {
    vi.mocked(getQuestsLoadingStatus).mockReturnValue('error');

    renderMainPage();

    expect(
      screen.getByText(
        'Не удалось загрузить квесты. Попробуйте обновить страницу.',
      ),
    ).toBeInTheDocument();
  });

  it('should render quests on success', () => {
    renderMainPage();

    expect(screen.getByText('Маньяк')).toBeInTheDocument();
    expect(screen.queryByText('Склеп')).not.toBeInTheDocument();
  });

  it('should dispatch filter change actions', async () => {
    const user = userEvent.setup();

    renderMainPage();

    await user.click(screen.getByText('Выбрать ужасы'));
    await user.click(screen.getByText('Выбрать сложный'));

    expect(changeQuestType).toHaveBeenCalledWith('horror');
    expect(changeQuestLevel).toHaveBeenCalledWith('hard');

    expect(mocks.dispatch).toHaveBeenCalledWith({
      type: 'quests/changeQuestType',
      payload: 'horror',
    });

    expect(mocks.dispatch).toHaveBeenCalledWith({
      type: 'quests/changeQuestLevel',
      payload: 'hard',
    });
  });
});
