<template>
  <div class="files g-column">
    <div class="g-row m-b-35">
      <label class="button">
        <svg-icon icon="btnAdd" width="32" height="23" />
        <input type="file" @change="onFileChange">
      </label>
      <button @click="onFileDownload" class="m-l-5">
        <svg-icon icon="btnOpen" width="32" height="23" />
      </button>
      <button @click="onFileCheck" class="m-l-5">
        <svg-icon icon="btnCheck" width="32" height="23" />
      </button>
      <button @click="onFileRemove" class="m-l-35">
        <svg-icon icon="btnClear" width="32" height="23" />
      </button>
    </div>
    <template v-if="fileSelected">
      <div class="file-info">
        <small class="file-info_label">File name:</small>
        <span class="file-info_name">{{ fileSelected.name }}</span>
      </div>
      <div class="file-info">
        <small class="file-info_label">File created:</small>
        <span class="file-info_name">{{ $dateFormat(fileSelected.createDateTime) }}</span>
      </div>
      <div class="file-info">
        <small class="file-info_label">File size:</small>
        <span class="file-info_name">{{ fileSelected.size }}</span>
      </div>
    </template>
  </div>
</template>
<script src="./sidebar.ts" lang="ts"></script>
<style lang="scss" scoped>
.files {
  display: flex;
  padding-top: 15px;
  padding-left: 15px;
  padding-top: 5px;
  button {
    width: 32px;
    height: 25px;
    padding: 0;
    background: none;
    border: none;
    cursor: pointer;
    opacity: 0.85;

    &:hover {
      opacity: 1;
    }

    &:active {
      opacity: 1;
      transform: scale(0.85);
    }
  }
  .file-info {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding-right: 15px;
    margin-bottom: 15px;
    &_label {
      color: var(--blue-gray);
      margin-bottom: 5px;
    }
    &_name {
      font-size: 12px;
      color: var(--editor-yellow);
      white-space: pre-line;
      word-wrap: break-word;
    }
  }
}
</style>
