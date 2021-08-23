<template>
  <div class="preferences">
    <div class="title">Preferences</div>
    <form ref="form" class="preferences_form">
      <div>
        <div class="form-group">
          <div class="form-group-inner">
            <label
              class="m-b-5"
              :class="{ error: errors.downloadsTargetPath }"
            >
              Downloads target path:
            </label>
            <input
              type="text"
              :class="{ error: errors.downloadsTargetPath }"
              v-model="preferences.downloadsTargetPath"
              name="downloadsTargetPath"
              readonly
              required
            >
            <span class="form-label-error" v-show="errors.downloadsTargetPath">
              Field can't be empty
            </span>
          </div>
          <div class="form-group-btn">
            <button class="btn btn-default" @click.prevent="openFolderDialog">Change</button>
          </div>
        </div>
      </div>
      <div>
        <div class="form-group">
          <div class="form-group-inner flex-between items-center">
            <label class="m-b-5">Run App when Windows startup</label>
            <b-checkbox v-model="isAutoLaunchEnabled" />
          </div>
        </div>
      </div>
      <div>
        <div class="form-group">
          <div class="form-group-inner flex-between items-center">
            <label class="m-b-5">Create Yandex.Disk Path</label>
            <button class="btn btn-primary" @click="createYandexDiskPath">Create</button>
          </div>
        </div>
      </div>
      <div>
        <div class="form-group">
          <div class="form-group-inner">
            <label class="m-b-5">Paste the Code here:</label>
            <div class="flex-between items-center">
              <input type="text" v-model="yandexDiskResponseCode">
              <div class="form-group-btn">
                <button class="btn btn-primary" @click.stop.prevent="yandexCodeApply">Apply</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
    <div class="btn_wrapper">
      <button class="btn btn-primary" @click.prevent="save">Save</button>
      <button class="btn btn-default m-l-15" @click.prevent="cancel">Cancel</button>
    </div>
  </div>
</template>
<script src="./preferences.ts" lang="ts"></script>
