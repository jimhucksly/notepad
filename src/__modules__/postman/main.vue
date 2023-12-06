<template>
  <div class="postman_cont">
    <div class="g-row basis-100">
      <div class="col g-column" style="border-right: 1px solid var(--blue-gray)">
        <div class="caption white--text">Request</div>
        <form>
          <div class="form-group">
            <div style="width: 150px;" class="m-r-5">
              <select v-model="method" name="method">
                <option value="GET">GET</option>
                <option value="POST">POST</option>
              </select>
            </div>
            <input
              type="text"
              v-model="url"
              name="url"
            >
          </div>
          <div class="form-group g-column basis-100">
            <div class="g-column w-full h-full">
              <b-tabs v-model="tab">
                <template #default="props">
                  <b-tab :value="headerTab" v-bind="props">Headers</b-tab>
                  <b-tab :value="bodyTab" v-bind="props">Body</b-tab>
                </template>
              </b-tabs>
              <div class="white--bg basis-100 p-x-5 p-y-5 scroller" v-if="tab === headerTab">
                <template v-for="(item, index) in headers">
                  <div class="g-row m-b-5">
                    <div style="width: 35%">
                      <input
                        type="text"
                        v-model="item.key"
                        name=""
                      >
                    </div>
                    <div style="width: 65%" class="p-l-5">
                      <input
                        type="text"
                        v-model="item.value"
                        name=""
                      >
                    </div>
                    <button
                      class="close-button remove-button"
                      style="height: var(--input-height); cursor: pointer"
                      @click="onRemoveHeader(index)"
                    >
                    </button>
                  </div>
                </template>
                <button class="btn btn-default" @click="onAddHeader">
                  Add
                </button>
              </div>
              <div class="g-column white--bg basis-100" v-if="tab === bodyTab">
                <editor
                  :value="body"
                  lang="javascript"
                  width="100%"
                  height="100%"
                  @init="onEditorInit($event)"
                />
              </div>
            </div>
          </div>
        </form>
      </div>
      <div class="col g-column">
        <div class="caption white--text">Response</div>
        <div class="response basis-100">
          <textarea id="response" style="display: none;"></textarea>
        </div>
      </div>
    </div>
    <div class="btn_wrapper">
      <b-btn :primary="true" label="Send" :processing="fetching" @click="send" />
    </div>
    <div class="g-row" style="">
    </div>
  </div>
</template>
<script src="./main.ts" lang="ts"></script>
<style lang="scss" scoped>
.postman_cont {
  display: flex;
  flex-direction: column;
  background: var(--dark_darken-1);
  .col {
    width: 50%;
  }

  .caption {
    display: flex;
    height: 54px;
    align-items: center;
    padding-left: 15px;
  }

  form {
    display: flex;
    flex-direction: column;
    flex-basis: 100%;
    padding: 15px;
    overflow-x: hidden;
    overflow-y: auto;

    input {
      letter-spacing: 1px;
    }
  }

  .response {
    padding: 15px;
    color: var(--blue-gray);
  }

  .scroller {
    overflow-y: auto;
  }

  .btn_wrapper {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 15px;
    flex-basis: 65px;
    flex-grow: 0;
    border-top: 1px solid var(--blue-gray);
  }
}
</style>
