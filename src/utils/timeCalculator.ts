import { Duration } from "luxon";

// Converte HH:MM para Luxon Duration
const toDuration = (time: string): Duration => {
  const [hours, minutes] = time.split(":").map(Number);
  return Duration.fromObject({ hours, minutes });
};

// Enum de operações
export enum TimeOperation {
  ADD = "add",
  SUBTRACT = "subtract",
}

// Soma duas horas
export const addTimes = (time1: string, time2: string): string => {
  const duration1 = toDuration(time1);
  const duration2 = toDuration(time2);

  // Ajusta o total de horas e minutos
  const totalHours = duration1.hours + duration2.hours;
  const totalMinutes = duration1.minutes + duration2.minutes;

  const adjustedHours =
    totalMinutes >= 60
      ? totalHours + Math.floor(totalMinutes / 60)
      : totalHours;
  const adjustedMinutes = totalMinutes % 60;

  return Duration.fromObject({
    hours: adjustedHours,
    minutes: adjustedMinutes,
  }).toFormat("hh:mm");
};

// Subtrai duas horas
export const subtractTimes = (time1: string, time2: string): string => {
  const duration1 = toDuration(time1);
  const duration2 = toDuration(time2);

  const totalMinutes = duration1.as("minutes") - duration2.as("minutes");
  return Duration.fromObject({
    minutes: totalMinutes >= 0 ? totalMinutes : totalMinutes + 24 * 60,
  }).toFormat("hh:mm");
};

// Calcula a operação baseada no enum
export const calculateTime = (
  time1: string,
  time2: string,
  operation: TimeOperation
): string => {
  return operation === TimeOperation.ADD
    ? addTimes(time1, time2)
    : subtractTimes(time1, time2);
};
