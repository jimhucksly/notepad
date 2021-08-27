<template>
  <div>
    <titlebar id="titlebar" />
    <main>
      <sidebar v-if="isSidebar" id="sidebar" />
      <section>
        <loading v-if="loading" />
        <template v-else>
          <auth v-if="!isAuth" id="auth" />
          <div v-else-if="isYandexDisk">
            <img src="/static/yd.png">
          </div>
          <component v-else-if="isComponent" :is="component" />
        </template>
        <error v-if="isError" />
      </section>
    </main>
  </div>
</template>
<script src="./index.ts" lang="ts"></script>
