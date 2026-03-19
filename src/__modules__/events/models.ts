export interface IEvents {
  [date: string]: {
    title: string;
    content: string;
  };
}

export interface IEvent {
  /*
   * 01.03.2020
   */
  date?: string;
  title: string;
  content: string;
}

export interface IEventsState {
  events: IEvents;
}
