import { fireEvent, render, screen } from '@testing-library/react';

import QuestFilter from './quest-filter';
import { QuestLevel, QuestType } from '../../types/api';

describe('Component: QuestFilter', () => {
  const handleTypeChange = vi.fn();
  const handleLevelChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render type and level filters', () => {
    render(
      <QuestFilter
        activeType="all"
        activeLevel="any"
        onTypeChange={handleTypeChange}
        onLevelChange={handleLevelChange}
      />,
    );

    expect(screen.getByLabelText('Все квесты')).toBeChecked();
    expect(screen.getByLabelText('Приключения')).toBeInTheDocument();
    expect(screen.getByLabelText('Ужасы')).toBeInTheDocument();
    expect(screen.getByLabelText('Мистика')).toBeInTheDocument();
    expect(screen.getByLabelText('Детектив')).toBeInTheDocument();
    expect(screen.getByLabelText('Sci-fi')).toBeInTheDocument();

    expect(screen.getByLabelText('Любой')).toBeChecked();
    expect(screen.getByLabelText('Лёгкий')).toBeInTheDocument();
    expect(screen.getByLabelText('Средний')).toBeInTheDocument();
    expect(screen.getByLabelText('Сложный')).toBeInTheDocument();
  });

  it('should check active type and active level', () => {
    render(
      <QuestFilter
        activeType="horror"
        activeLevel="medium"
        onTypeChange={handleTypeChange}
        onLevelChange={handleLevelChange}
      />,
    );

    expect(screen.getByLabelText('Ужасы')).toBeChecked();
    expect(screen.getByLabelText('Средний')).toBeChecked();
  });

  it('should call onTypeChange when user chooses quest type', () => {
    render(
      <QuestFilter
        activeType="all"
        activeLevel="any"
        onTypeChange={handleTypeChange}
        onLevelChange={handleLevelChange}
      />,
    );

    fireEvent.click(screen.getByLabelText('Детектив'));

    expect(handleTypeChange).toHaveBeenCalledWith(
      'detective' satisfies QuestType,
    );
  });

  it('should call onLevelChange when user chooses quest level', () => {
    render(
      <QuestFilter
        activeType="all"
        activeLevel="any"
        onTypeChange={handleTypeChange}
        onLevelChange={handleLevelChange}
      />,
    );

    fireEvent.click(screen.getByLabelText('Сложный'));

    expect(handleLevelChange).toHaveBeenCalledWith('hard' satisfies QuestLevel);
  });
});
