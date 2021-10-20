class HubPlugin {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  $on(eventName: string, callback: (args: any) => any) {
    //
  }

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  $off(eventName: string, callback: (args: any) => any) {
    //
  }

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  $emit(eventName: string, args?: any) {
    //
  }
}

export const Hub = new HubPlugin()
