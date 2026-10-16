export async function uploadFile(multiple: boolean = false, accept: string = ''): Promise<InputEvent> {
  if (!document) {
    return;
  }
  const el = document.createElement('input');
  el.type = 'file';
  el.name = 'file';
  if (multiple) {
    el.multiple = true;
  }
  if (accept) {
    el.accept = accept;
  }
  el.style.display = 'none';
  let resolveFunc: (value?: InputEvent) => void = null;
  const promise: Promise<InputEvent> = new Promise(resolve => {
    resolveFunc = resolve;
  });
  const teardown = () => {
    document.body.removeEventListener('focus', teardown, true);
    setTimeout(() => {
      try {
        document.body.removeChild(el);
      } catch (e) {
        //
      }
    }, 1000);
  };

  el.addEventListener('change', (event: InputEvent) => {
    teardown();
    resolveFunc(event);
  });

  el.addEventListener('cancel', (event: Event) => {
    teardown();
    resolveFunc();
  });

  document.body.addEventListener('focus', teardown, true);
  document.body.appendChild(el);
  el.click();
  const event = await promise;
  if (!event) {
    return null;
  }
  return event;
}
