import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import QuestCard from './quest-card';
import { QuestPreview } from '../../types/api';

const mockQuest: QuestPreview = {
  id: 'a0e73052-0ad8-4fbb-80d5-fc779fc9c721',
  title: 'Маньяк',
  previewImg: 'img/content/maniac/maniac-size-s.jpg',
  previewImgWebp: 'img/content/maniac/maniac-size-s.webp',
  level: 'medium',
  type: 'horror',
  peopleMinMax: [3, 6],
};

describe('Component: QuestCard', () => {
  it('should render quest card correctly', () => {
    render(
      <MemoryRouter>
        <QuestCard quest={mockQuest} />
      </MemoryRouter>,
    );

    expect(screen.getByText('Маньяк')).toBeInTheDocument();
    expect(screen.getByText(/3–6\s*чел/)).toBeInTheDocument();
    expect(screen.getByText('Средний')).toBeInTheDocument();

    expect(screen.getByRole('img')).toHaveAttribute(
      'src',
      mockQuest.previewImg,
    );
    expect(screen.getByRole('img')).toHaveAttribute('alt', 'Квест Маньяк');
  });

  it('should render link to quest page', () => {
    render(
      <MemoryRouter>
        <QuestCard quest={mockQuest} />
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: 'Маньяк' })).toHaveAttribute(
      'href',
      `/quest/${mockQuest.id}`,
    );
  });

  it('should render one person count if min and max are equal', () => {
    render(
      <MemoryRouter>
        <QuestCard quest={{ ...mockQuest, peopleMinMax: [4, 4] }} />
      </MemoryRouter>,
    );

    expect(screen.getByText(/4\s*чел/)).toBeInTheDocument();
  });
});
