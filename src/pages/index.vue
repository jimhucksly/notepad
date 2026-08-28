<template>
  <titlebar />
  <main>
    <sidebar v-if="isSidebar" id="sidebar" />
    <section>
      <b-loader :visible="loading" v-if="loading" />
      <template v-else>
        <template v-if="!isAuth">
          <auth v-if="isAuthWindow" id="auth" />
          <reg v-if="isRegWindow" id="reg" />
          <reset v-if="isResetWindow" id="reset" />
          <verify v-if="isVerifyWindow" id="verify" />
        </template>
        <yandex v-if="isYandexWindow" id="yandex" />
        <component :is="component" v-else-if="isComponent" />
      </template>
      <error v-if="isError" />
    </section>
  </main>
  <b-dialog />
</template>
<script src="./index.ts" lang="ts"></script>
