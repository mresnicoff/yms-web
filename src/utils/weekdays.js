export const WEEKDAYS = [0, 1, 2, 3, 4, 5, 6];

export const WEEKDAY_LABELS = {
  0: "Domingo",
  1: "Lunes",
  2: "Martes",
  3: "Miércoles",
  4: "Jueves",
  5: "Viernes",
  6: "Sábado"
};

export const defaultWeeklySchedules = () =>
  WEEKDAYS.map((weekday) => ({
    weekday,
    closed: false,
    startTime: "08:00",
    endTime: "17:00"
  }));
