<template>
  <div class="account">
    <div class="title">Account</div>
    <div class="account-content">
      <div class="content-row">
        <label>Login</label>
        <span>{{ currentUser.login }}</span>
      </div>
      <div class="content-row">
        <label>E-mail</label>
        <span>{{ currentUser.email }}</span>
      </div>
    </div>
    <div class="account-actions">
      <button class="btn btn-danger" @click.prevent="logout">Logout</button>
      <button class="btn btn-default m-l-15" @click.prevent="cancel">Cancel</button>
    </div>
  </div>
</template>
<script src="./account.ts" lang="ts"></script>
