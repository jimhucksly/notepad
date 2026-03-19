class HubPlugin {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  listeners: Record<string, Array<(args: any) => any>> = {};

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  $on(eventName: string, callback: (args: any) => any) {
    if (eventName in this.listeners) {
      this.listeners[eventName].push(callback);
    } else {
      this.listeners[eventName] = [];
      this.listeners[eventName].push(callback);
    }
  }

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  $off(eventName: string, callback: (args: any) => any) {
    const map = new Map();
    if (eventName in this.listeners) {
      this.listeners[eventName].forEach((listener, index) => {
        map.set(listener, index);
      });
      const index = map.get(callback);
      if (index !== undefined) {
        this.listeners[eventName].splice(index, 1);
      }
    }
  }

  $flush() {
    for (const key in this.listeners) {
      this.listeners[key] = [];
    }
    this.listeners = {};
  }

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  $emit(eventName: string, ...args: any) {
    if (eventName in this.listeners) {
      this.listeners[eventName].forEach(listener => {
        Function.prototype.apply.call(listener, this, args);
      });
    }
  }
}

export const Hub = new HubPlugin();
