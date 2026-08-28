import { ConfirmDialog, DialogManager } from '@dn-web/ui';
import { injectable } from 'inversify';
import { IQueryHandler } from '../interfaces';

export class ConfirmWindowQuery {
  constructor(public question: string) {}
}

@injectable()
export class ConfirmWindowQueryHandler implements IQueryHandler<ConfirmWindowQuery, boolean> {
  exec(query: ConfirmWindowQuery): Promise<boolean> {
    return DialogManager.exec(
      new ConfirmDialog({
        title: 'Confirmation',
        content: query.question,
        width: '30%',
      })
    );
  }
}
