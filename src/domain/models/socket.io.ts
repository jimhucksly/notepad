/* eslint-disable camelcase, @typescript-eslint/no-empty-interface */
export interface ServerToClientEvents {
  connected: (id: string) => void;
}

export interface ClientToServerEvents {
  //
}
