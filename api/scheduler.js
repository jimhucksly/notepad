function scheduler($app) {

  async function db_delete_expired_tokens() {
    const tokens = await $app.db.query().tokens().get()
    for (const item of tokens) {
      if (new Date().getTime() > new Date(item.token_expired).getTime()) {
        await $app.db.command().tokens(item.token).delete()
      }
    }
  }

  function start(interval) {
    setInterval(() => {
      db_delete_expired_tokens()
    }, interval)
  }

  return {
    start
  }
}

module.exports = scheduler