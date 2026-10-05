<template>
  <BettingCenter :category="0" :venueType="0"></BettingCenter>
</template>

<script setup lang="ts">
defineOptions({ name: 'OPERATEMANAGER_SPORTBETTINGCENTER' });

import BettingCenter from '../com/bettingCenter/index.vue';
</script>
