<template>
  <div>
    <titlebar />
    <main>
      <sidebar v-if="isAuth && !loading" />
      <section>
        <loading v-if="loading" />
        <template v-else>
          <auth v-if="!isAuth" />
          <component v-else :is="component" />
        </template>
        <error v-if="isError" />
      </section>
    </main>
  </div>
</template>
<script src="./index.ts" lang="ts"></script>
