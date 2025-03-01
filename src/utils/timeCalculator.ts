import { Duration } from "luxon";

// Enum de operações
export enum TimeOperation {
  ADD = "add",
  SUBTRACT = "subtract",
}

// Converte HH:MM para Luxon Duration
const toDuration = (time: string): Duration => {
  const [hours, minutes] = time.split(":").map(Number);
  return Duration.fromObject({ hours, minutes });
};

// Soma duas horas
export const addTimes = (time1: string, time2: string): string =>
  toDuration(time1).plus(toDuration(time2)).toFormat("hh:mm");

// Subtrai duas horas
export const subtractTimes = (time1: string, time2: string): string => {
  const totalMinutes =
    toDuration(time1).as("minutes") - toDuration(time2).as("minutes");
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
