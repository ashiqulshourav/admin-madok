<template>
  <BettingCenter :category="1" :venueType="1"></BettingCenter>
</template>

<script setup lang="ts">
defineOptions({ name: 'OPERATEMANAGER_ESPORTBETTINGCENTER' });
import BettingCenter from '../com/bettingCenter/index.vue';
</script>
