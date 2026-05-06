import { fireEvent, render, screen } from '@testing-library/react';

import BookingSlots from './booking-slots';
import { BookingPlace } from '../../types/api';

const mockPlace: BookingPlace = {
  id: 'place-1',
  location: {
    address: 'наб. реки Карповки 5',
    coords: [59.968322, 30.317359],
  },
  slots: {
    today: [
      {
        time: '09:45',
        isAvailable: true,
      },
      {
        time: '15:00',
        isAvailable: false,
      },
    ],
    tomorrow: [
      {
        time: '11:00',
        isAvailable: true,
      },
      {
        time: '21:30',
        isAvailable: true,
      },
    ],
  },
};

describe('Component: BookingSlots', () => {
  const handleSlotChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render nothing if selectedPlace is null', () => {
    const { container } = render(
      <BookingSlots
        selectedPlace={null}
        selectedDate="today"
        selectedTime={null}
        slotError={null}
        onSlotChange={handleSlotChange}
      />,
    );

    expect(container.firstChild).toBeNull();
  });

  it('should render slots grouped by date', () => {
    render(
      <BookingSlots
        selectedPlace={mockPlace}
        selectedDate="today"
        selectedTime={null}
        slotError={null}
        onSlotChange={handleSlotChange}
      />,
    );

    expect(screen.getByText('Сегодня')).toBeInTheDocument();
    expect(screen.getByText('Завтра')).toBeInTheDocument();

    expect(screen.getByLabelText('09:45')).toBeInTheDocument();
    expect(screen.getByLabelText('15:00')).toBeDisabled();
    expect(screen.getByLabelText('11:00')).toBeInTheDocument();
    expect(screen.getByLabelText('21:30')).toBeInTheDocument();
  });

  it('should check selected slot', () => {
    render(
      <BookingSlots
        selectedPlace={mockPlace}
        selectedDate="tomorrow"
        selectedTime="21:30"
        slotError={null}
        onSlotChange={handleSlotChange}
      />,
    );

    expect(screen.getByLabelText('21:30')).toBeChecked();
  });

  it('should call onSlotChange when user chooses available slot', () => {
    render(
      <BookingSlots
        selectedPlace={mockPlace}
        selectedDate="today"
        selectedTime={null}
        slotError={null}
        onSlotChange={handleSlotChange}
      />,
    );

    fireEvent.click(screen.getByLabelText('11:00'));

    expect(handleSlotChange).toHaveBeenCalledWith('tomorrow', '11:00');
  });

  it('should render slot error', () => {
    render(
      <BookingSlots
        selectedPlace={mockPlace}
        selectedDate="today"
        selectedTime={null}
        slotError="Выберите место, дату и время бронирования"
        onSlotChange={handleSlotChange}
      />,
    );

    expect(
      screen.getByText('Выберите место, дату и время бронирования'),
    ).toBeInTheDocument();
  });
});
