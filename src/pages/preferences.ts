import { ConfirmDialog, DialogManager } from '@dn-web/ui';
import AutoLaunch from 'auto-launch';
import { Vue } from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import { Getter, Mutation } from 'vuex-class';
import { RevokeYandexTokenCommand, UpdatePasswordCommand } from '~/domain/commands';
import { IResponse, IUser, IValidate } from '~/domain/models';
import pkg from '../../package.json';

export default class Preferences extends Vue {
  @Mutation('setYandexApiToken') setYandexApiToken: (value: string) => void;

  @Getter('getUserDataPath') userDataPath: string;
  @Getter('getYandexApiToken') yandexApiToken: string;
  @Getter('getCurrentUser') currentUser: IUser;

  appAutoLauncher: AutoLaunch = null;
  isAutoLaunchEnabled = false;
  yandexDiskResponseCode = '';
  createYandexDiskStepTwo = false;

  isResetPasswordMode = false;
  oldPass = '';
  errorMessage = '';
  newPass = '';
  repeatNewPass = '';

  v: IValidate = {};
  isSubmitted = false;

  @Watch('isResetPasswordMode') onIsResetPasswordModeChanged() {
    if (this.isResetPasswordMode) {
      this.$nextTick(() => {
        this.$validate(this);
      });
    }
  }

  @Watch('oldPass') onOldPassChanged() {
    this.errorMessage = '';
  }

  mounted() {
    const appAutoLauncher = new AutoLaunch({
      name: pkg.build.productName.replace(/ /g, ''),
    });

    this.appAutoLauncher = appAutoLauncher;

    appAutoLauncher
      .isEnabled()
      .then((isEnabled: boolean) => {
        this.isAutoLaunchEnabled = isEnabled;
      })
      .catch(e => {
        /* eslint-disable no-console */
        console.error(e);
      });
  }

  async validate(): Promise<boolean> {
    await this.v.touch();
    return this.v.valid();
  }

  async save() {
    // storage.append(this.userDataPath, 'UserPreferences', {
    //   downloadsTargetPath: this.preferences.downloadsTargetPath
    // })
    // this.setDownloadsTargetPath(this.preferences.downloadsTargetPath)

    const isAutoLauncherEnabled = await this.appAutoLauncher.isEnabled();

    if (this.isAutoLaunchEnabled) {
      if (!isAutoLauncherEnabled) {
        this.appAutoLauncher.enable();
      }
    } else if (isAutoLauncherEnabled) {
      this.appAutoLauncher.disable();
    }

    if (this.isResetPasswordMode) {
      this.isSubmitted = true;
      if (!(await this.validate())) {
        return;
      }
      try {
        await this.$app.$commandBus.do(new UpdatePasswordCommand(this.oldPass, this.newPass));
        this.$toasted.success('Your password is updated');
        this.$app.logout();
      } catch (e) {
        this.$app.loading(false);
        this.handleError(e);
      }
      return;
    }
    this.$app.goBack();
  }

  handleError(e: IResponse<{ message: string }>) {
    if (e?.data?.message === 'Password is incorrect') {
      (this.v as { oldPass: { isInvalid: boolean } }).oldPass.isInvalid = true;
      this.errorMessage = 'Password is incorrect';
    }
  }

  cancel() {
    this.$app.goBack();
  }

  // openFolderDialog() {
  //   this.$electron.ipcRenderer.send('open-folder-dialog', {
  //     defaultPath: this.downloadsTargetPath
  //   })
  //   this.$electron.ipcRenderer.on(
  //     'open-dialog-paths-selected',
  //     /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  //     (event: Electron.IpcRendererEvent, response: any) => {
  //       const path = response && response.filePaths && response.filePaths[0]
  //         ? response.filePaths[0]
  //         : null
  //       const currentPath = this.preferences.downloadsTargetPath || this.userDataPath
  //       this.preferences.downloadsTargetPath = path ?? currentPath
  //     }
  //   )
  // }

  async revoke() {
    const isConfirm = await DialogManager.exec(
      new ConfirmDialog({
        title: 'Confirm',
        content: 'Do you want to revoke the Yandex.Disk connection?',
      })
    );
    if (!isConfirm) {
      return;
    }
    try {
      await this.$app.$commandBus.do(new RevokeYandexTokenCommand());
      location.reload();
    } catch (e) {
      //
    }
  }

  get isYandexApiTokenExist() {
    return Boolean(this.currentUser.yandexDiskAccessToken);
  }
}
