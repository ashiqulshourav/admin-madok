<template>
  <PlayerList :category="1" :venueType="1"></PlayerList>
</template>

<script setup lang="ts">
import PlayerList from '../com/playerList/index.vue';
defineOptions({ name: 'OPERATEMANAGER_ESPORTPLAYERLIST' });
</script>
