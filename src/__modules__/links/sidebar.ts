import { uniqueID } from '@dn-web/core';
import { CreateEditDialog, DialogManager } from '@dn-web/ui';
import { Vue } from 'vue-class-component';
import { UpdateLinksCommand } from './commands/commands';
import { ILink } from './models';
import { LinksQuery } from './queries/queries';

export default class LinksSidebar extends Vue {
  async addLink() {
    const result: ILink = await DialogManager.exec(
      new CreateEditDialog({
        title: 'Add link',
        component: 'Links-Modal-createEdit',
        componentProps: {
          model: null,
        },
        width: '30%',
      })
    );
    if (!result) {
      return;
    }
    if (!result.id) {
      result.id = uniqueID(6) as string;
    }
    await this.$app.$commandBus.do(new UpdateLinksCommand(result));
    await this.$app.$queryBus.exec(new LinksQuery());
  }
}
