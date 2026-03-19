/* eslint-disable camelcase, @typescript-eslint/naming-convention */

import { IApp } from './model';

function scheduler($app: IApp) {
  /* eslint-disable camelcase */
  async function db_delete_expired_tokens() {
    const tokens = await $app.db.query().tokens().get();
    for (const item of tokens) {
      if (new Date().getTime() > new Date(item.token_expired).getTime()) {
        await $app.db.command().token(item.token).delete();
      }
    }
  }

  function start(interval: number) {
    setInterval(() => {
      db_delete_expired_tokens();
    }, interval);
  }

  return {
    start,
  };
}

export default scheduler;
