/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export async function awaiting(callback: () => unknown): Promise<any> {
  let resolveFunc: (value: unknown) => void = null;
  const counter = 0;
  let timer: unknown = null;
  const promise = new Promise(resolve => {
    resolveFunc = resolve;
  });
  timer = setInterval(() => {
    const a = callback();
    if (counter > 100 || Boolean(a)) {
      clearInterval(timer as number);
      resolveFunc(a ?? true);
    }
  }, 100);
  await promise;
}
