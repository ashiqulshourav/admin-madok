<template>
  <PlayerList :category="0" :venueType="0"></PlayerList>
</template>

<script setup lang="ts">
import PlayerList from '../com/playerList/index.vue';

defineOptions({ name: 'OPERATEMANAGER_SPORTPLAYERLIST' });
</script>
