<template>
  <div>
    <titlebar />
    <main>
      <sidebar v-if="isAuth && !loading"></sidebar>
      <section>
        <loading v-if="loading"></loading>
        <template v-else>
          <auth v-if="!isAuth"></auth>
          <preferences v-else-if="isPreferences" />
          <notepad v-else-if="isProjects" />
          <markdown v-else-if="isMarkdown"/>
          <div v-else></div>
        </template>
        <error v-if="isError"></error>
      </section>
    </main>
  </div>
</template>
<script src="./index.ts" lang="ts"></script>
