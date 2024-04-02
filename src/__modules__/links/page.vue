<template>
  <div class="links_cont">
    <div v-if="isEmpty" class="empty_cont">
      No elements found
    </div>
    <div class="links_area" v-if="links">
      <ul>
        <li v-for="(item, index) in links" :key="index">
          <a href="/" @click.prevent="open(item.url)">{{ getName(item, index) }}</a>
          <button @click="edit(item.id)">
            <svg-icon icon="linkIcon" width="16px" height="16px" />
          </button>
          <button @click="remove(item.id)">
            <svg-icon icon="removeIcon" />
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>
<script src="./page.ts" lang="ts"></script>
<style lang="scss" scoped>
.links_cont {
  display: flex;
  flex-direction: column;
  flex-basis: 100%;
  flex-grow: 1;
  padding: 6px;
  padding-right: 0;
  background-color: var(--grey);
  overflow: hidden;

  .links_area {
    font-family: var(--font-gotham);
    color: rgb(0,0,0);
    flex-basis: 100%;
    background-color: #fff;
    border: 1px solid var(--blue-gray_light);
    border-right-width: 0;
    padding: 12px;
    padding-right: 0;
    overflow-x: hidden;
    overflow-y: auto;

    ul {
      li {
        display: flex;
        align-items: center;
        padding-left: 6px;
        transition: all 0.2s;
        a {
          display: block;
          flex-basis: 100%;
          font-size: 1.1rem;
          padding: 6px 0;
          color: var(--dark);
          text-decoration: none;
          transition: all 0.2s;

          &:hover {
            color: var(--blue);
          }
        }
        button {
          display: none;
          align-items: center;
          justify-content: center;
          width: 22px;
          height: 22px;
          flex-shrink: 0;
          margin-right: 12px;
          transition: all 0.2s;
          cursor: pointer;
          border: none;
          background: none;
          padding: 0;
          opacity: 0.4;
          &:hover {
            opacity: 0.9;
          }
          svg {
            display: block;
            width: 100%;
            max-width: 100%;
          }
        }
        &:hover {
          background-color: var(--blue-gray_light);
          button {
            display: flex;
          }
        }
      }
    }
  }
  .links_input {
    height: 30px;
    flex-shrink: 0;
    margin-bottom: 6px;
  }
}
</style>
