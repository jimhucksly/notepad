<template>
  <titlebar />
  <main>
    <sidebar v-if="isSidebar" id="sidebar" />
    <section>
      <loading v-if="loading" />
      <template v-else>
        <template v-if="!isAuth">
          <auth v-if="isAuthWindow" id="auth" />
          <reg v-if="isRegWindow" id="reg" />
          <reset v-if="isResetWindow" id="reset" />
          <verify v-if="isVerifyWindow" id="verify" />
          <yandex v-if="isYandexWindow" id="yandex" />
        </template>
        <component v-if="isComponent" :is="component" />
      </template>
      <error v-if="isError" />
    </section>
  </main>
</template>
<script src="./index.ts" lang="ts"></script>
