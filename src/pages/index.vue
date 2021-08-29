<template>
  <div>
    <titlebar id="titlebar" />
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
                <button
                  class="btn btn-primary m-t-10"
                  :class="{ 'btn-processing': yandexCodeApplyProcessing }"
                  @click.prevent="yandexCodeApply"
                >
                  <template v-if="yandexCodeApplyProcessing">
                    <span class="processing-indicator-1"></span>
                    <span class="processing-indicator-2"></span>
                    <span class="processing-indicator-3"></span>
                  </template>
                  <span v-else>Apply</span>
                </button>
              </template>
            </form>
          </div>
          <component v-else-if="isComponent" :is="component" />
        </template>
        <error v-if="isError" />
      </section>
    </main>
  </div>
</template>
<script src="./index.ts" lang="ts"></script>
