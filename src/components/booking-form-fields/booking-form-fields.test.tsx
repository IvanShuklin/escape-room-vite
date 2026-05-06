import { render, screen } from '@testing-library/react';
import { useForm } from 'react-hook-form';

import BookingFormFields, { BookingFormData } from './booking-form-fields';

type BookingFormFieldsWrapperProps = {
  errors?: Parameters<typeof BookingFormFields>[0]['errors'];
  peopleMin?: number;
  peopleMax?: number;
};

function BookingFormFieldsWrapper({
  errors = {},
  peopleMin = 2,
  peopleMax = 5,
}: BookingFormFieldsWrapperProps) {
  const { register } = useForm<BookingFormData>({
    defaultValues: {
      contactPerson: '',
      phone: '',
      peopleCount: peopleMin,
      withChildren: false,
      userAgreement: false,
    },
  });

  return (
    <BookingFormFields
      register={register}
      errors={errors}
      peopleMin={peopleMin}
      peopleMax={peopleMax}
    />
  );
}

describe('Component: BookingFormFields', () => {
  it('should render contact fields', () => {
    render(<BookingFormFieldsWrapper />);

    expect(screen.getByLabelText('Ваше имя')).toBeInTheDocument();
    expect(screen.getByLabelText('Контактный телефон')).toBeInTheDocument();
    expect(screen.getByLabelText('Количество участников')).toBeInTheDocument();
    expect(screen.getByLabelText('Со мной будут дети')).toBeInTheDocument();
  });

  it('should set min and max people count attributes', () => {
    render(<BookingFormFieldsWrapper peopleMin={3} peopleMax={6} />);

    const peopleCountInput = screen.getByLabelText('Количество участников');

    expect(peopleCountInput).toHaveAttribute('min', '3');
    expect(peopleCountInput).toHaveAttribute('max', '6');
  });

  it('should render validation errors', () => {
    render(
      <BookingFormFieldsWrapper
        errors={{
          contactPerson: {
            type: 'required',
            message: 'Укажите имя',
          },
          phone: {
            type: 'pattern',
            message:
              'Введите телефон в формате +7 (000) 000-00-00 или 89990000000',
          },
          peopleCount: {
            type: 'min',
            message: 'Минимум участников: 2',
          },
        }}
      />,
    );

    expect(screen.getByText('Укажите имя')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Введите телефон в формате +7 (000) 000-00-00 или 89990000000',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('Минимум участников: 2')).toBeInTheDocument();
  });
});
