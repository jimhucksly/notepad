export interface ITodo {
  [key: string]: {
    date: string;
    text: string;
    order: number;
  };
}

export interface ITodoItem {
  id: string;
  date: string;
  text: string;
  order: number;
}

export interface ITodoOrder {
  [id: string]: number;
}

export interface ITodoState {
  todo: ITodo;
}
