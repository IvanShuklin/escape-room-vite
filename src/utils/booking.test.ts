import {
  BookingDateTitle,
  bookingDates,
  getSlotId,
  normalizePhone,
  phonePattern,
} from './booking';

describe('booking utils', () => {
  describe('normalizePhone', () => {
    it('should convert phone starting with +7 to phone starting with 8', () => {
      expect(normalizePhone('+7 (999) 123-45-67')).toBe('89991234567');
    });

    it('should keep phone starting with 8', () => {
      expect(normalizePhone('8 999 123 45 67')).toBe('89991234567');
    });

    it('should remove non-digit characters from phone', () => {
      expect(normalizePhone('+7-999-123-45-67')).toBe('89991234567');
    });

    it('should return digits if phone cannot be converted from +7 format', () => {
      expect(normalizePhone('+48 123 456 789')).toBe('48123456789');
    });
  });

  describe('phonePattern', () => {
    it('should validate correct phone formats', () => {
      expect(phonePattern.test('+7 (999) 123-45-67')).toBe(true);
      expect(phonePattern.test('+7 999 123 45 67')).toBe(true);
      expect(phonePattern.test('89991234567')).toBe(true);
      expect(phonePattern.test('8 999 123-45-67')).toBe(true);
    });

    it('should not validate incorrect phone formats', () => {
      expect(phonePattern.test('+7 999')).toBe(false);
      expect(phonePattern.test('79991234567')).toBe(false);
      expect(phonePattern.test('+48 123 456 789')).toBe(false);
      expect(phonePattern.test('phone')).toBe(false);
    });
  });

  describe('getSlotId', () => {
    it('should create slot id from date and time', () => {
      expect(getSlotId('today', '09:45')).toBe('today09h45m');
      expect(getSlotId('tomorrow', '21:30')).toBe('tomorrow21h30m');
    });
  });

  it('should contain booking date titles', () => {
    expect(BookingDateTitle.today).toBe('Сегодня');
    expect(BookingDateTitle.tomorrow).toBe('Завтра');
  });

  it('should contain booking dates in render order', () => {
    expect(bookingDates).toEqual(['today', 'tomorrow']);
  });
});
