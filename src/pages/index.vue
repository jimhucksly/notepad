<template>
  <titlebar />
  <main>
    <sidebar v-if="isSidebar" id="sidebar" />
    <section>
      <loading v-if="loading" />
      <template v-else>
        <auth v-if="!isAuth" id="auth" />
        <div v-else-if="isYandexDisk" class="yd_cont">
          <div class="yd_cont_title">
            Connect please your Yandex.Disk
          </div>
          <svg-icon icon="yd" width="148" height="100" />
          <form>
            <template v-if="!createYandexDiskStepTwo">
              <button class="btn btn-default" @click.prevent="createYandexDiskPath">
                <strong>Go!</strong>
              </button>
            </template>
            <template v-else>
              <span class="p-b-5">Paste the Code here:</span>
              <input type="text" v-model="yandexDiskResponseCode">
              <b-btn
                primary
                label="Apply"
                class="m-t-10"
                :processing="yandexCodeApplyProcessing"
                @click="yandexCodeApply($event)"
              />
            </template>
          </form>
        </div>
        <component v-else-if="isComponent" :is="component" />
      </template>
      <error v-if="isError" />
    </section>
  </main>
</template>
<script src="./index.ts" lang="ts"></script>
