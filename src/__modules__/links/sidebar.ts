import { uniqueID } from '@dn-web/core';
import { Vue } from 'vue-class-component';
import { Queries, Types } from '~/core';
import { UpdateLinksCommand } from './commands/commands';
import { ILink } from './models';
import { LinksQuery } from './queries/queries';

export default class LinksSidebar extends Vue {
  async addLink() {
    const query = new Queries.CreateEditQuery<ILink>({
      component: 'Links-Modal-createEdit',
      modal: {
        title: 'Add link',
        width: '30%',
      },
    });
    const result = await this.$app.$queryBus.exec<Types.IPopupWindowQuery<ILink>, ILink>(query);
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
