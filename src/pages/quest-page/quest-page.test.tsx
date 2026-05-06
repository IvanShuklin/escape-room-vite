import { render, screen } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

import QuestPage from './quest-page';
import { clearQuest, loadQuest } from '../../store/quest/quest-slice';

const mocks = vi.hoisted(() => ({
  dispatch: vi.fn(),
  params: {
    questId: 'quest-1' as string | undefined,
  },
  state: {
    quest: {
      quest: null as null | {
        id: string;
        title: string;
        previewImg: string;
        previewImgWebp: string;
        level: 'easy' | 'medium' | 'hard';
        type: 'adventures' | 'horror' | 'mystic' | 'detective' | 'sci-fi';
        peopleMinMax: [number, number];
        description: string;
        coverImg: string;
        coverImgWebp: string;
      },
      loadingStatus: 'idle' as 'idle' | 'loading' | 'success' | 'error',
      errorType: null as null | 'not-found' | 'common',
    },
  },
}));

vi.mock('react-router-dom', async () => {
  const actual =
    await vi.importActual<typeof import('react-router-dom')>(
      'react-router-dom',
    );

  return {
    ...actual,
    useParams: () => mocks.params,
  };
});

vi.mock('../../store/hooks', () => ({
  useAppDispatch: () => mocks.dispatch,
  useAppSelector: (selector: (state: typeof mocks.state) => unknown) =>
    selector(mocks.state),
}));

vi.mock('../../store/quest/quest-slice', () => ({
  loadQuest: vi.fn((questId: string) => ({
    type: 'quest/loadQuest',
    payload: questId,
  })),
  clearQuest: vi.fn(() => ({ type: 'quest/clearQuest' })),
}));

vi.mock('../../components/quest-info/quest-info', () => ({
  default: ({
    quest,
  }: {
    quest: {
      title: string;
    };
  }) => <div>Информация о квесте: {quest.title}</div>,
}));

vi.mock('../not-found-page/not-found-page', () => ({
  default: () => <div>Страница не найдена</div>,
}));

const quest = {
  id: 'quest-1',
  title: 'Маньяк',
  previewImg: 'preview.jpg',
  previewImgWebp: 'preview.webp',
  level: 'hard' as const,
  type: 'horror' as const,
  peopleMinMax: [2, 5] as [number, number],
  description: 'Описание квеста',
  coverImg: 'cover.jpg',
  coverImgWebp: 'cover.webp',
};

const renderQuestPage = () =>
  render(
    <HelmetProvider>
      <MemoryRouter>
        <QuestPage />
      </MemoryRouter>
    </HelmetProvider>,
  );

describe('Page: QuestPage', () => {
  beforeEach(() => {
    mocks.dispatch.mockClear();
    mocks.params.questId = 'quest-1';
    mocks.state.quest = {
      quest: null,
      loadingStatus: 'idle',
      errorType: null,
    };

    vi.mocked(loadQuest).mockClear();
    vi.mocked(clearQuest).mockClear();
  });

  it('should dispatch loadQuest on mount', () => {
    renderQuestPage();

    expect(loadQuest).toHaveBeenCalledWith('quest-1');
    expect(mocks.dispatch).toHaveBeenCalledWith({
      type: 'quest/loadQuest',
      payload: 'quest-1',
    });
  });

  it('should dispatch clearQuest on unmount', () => {
    const { unmount } = renderQuestPage();

    unmount();

    expect(clearQuest).toHaveBeenCalledTimes(1);
    expect(mocks.dispatch).toHaveBeenCalledWith({ type: 'quest/clearQuest' });
  });

  it('should render loading message', () => {
    mocks.state.quest.loadingStatus = 'loading';

    renderQuestPage();

    expect(screen.getByText('Загружаем квест...')).toBeInTheDocument();
  });

  it('should render common error message', () => {
    mocks.state.quest.loadingStatus = 'error';
    mocks.state.quest.errorType = 'common';

    renderQuestPage();

    expect(
      screen.getByText('Не удалось загрузить информацию о квесте.'),
    ).toBeInTheDocument();
    expect(screen.getByText('Вернуться на главную')).toBeInTheDocument();
  });

  it('should render quest info on success', () => {
    mocks.state.quest.loadingStatus = 'success';
    mocks.state.quest.quest = quest;

    renderQuestPage();

    expect(screen.getByText('Информация о квесте: Маньяк')).toBeInTheDocument();
  });

  it('should render not found page when questId is missing', () => {
    mocks.params.questId = undefined;

    renderQuestPage();

    expect(screen.getByText('Страница не найдена')).toBeInTheDocument();
    expect(loadQuest).not.toHaveBeenCalled();
  });

  it('should render not found page when quest was not found', () => {
    mocks.state.quest.errorType = 'not-found';

    renderQuestPage();

    expect(screen.getByText('Страница не найдена')).toBeInTheDocument();
  });
});
