<template>
  {{ loading}}
  {{ searchResult }}
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';

import { SearchItemI } from '@/store/files/state';

const store = useStore();
const route = useRoute();

const searchResult = computed<SearchItemI[]>(() => store.state.files.searchResult);
const loading = ref(false);

async function getSearchResult() {
  const q = typeof route.query.q === 'string' ? route.query.q : '';
  await store.dispatch('files/search', {
    q,
    page: 1,
  });
}

onMounted(() => {
  getSearchResult();
});

</script>
