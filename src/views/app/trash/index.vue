<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-5xl mx-auto">

      <!-- Header -->
      <div class="mb-6">
        <div class="flex items-center gap-3 mb-1">
          <div class="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
            <i class="fa-solid fa-trash text-red-500 text-lg" />
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-800">Papelera</h1>
            <p class="text-sm text-gray-400">
              {{ totalItems }} elemento{{ totalItems !== 1 ? 's' : '' }} eliminado{{ totalItems !== 1 ? 's' : '' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Bulk actions bar -->
      <transition
        enter-active-class="animate__animated animate__fadeInDown animate__faster"
        leave-active-class="animate__animated animate__fadeOutUp animate__faster"
      >
        <div
          v-if="selectedIds.size > 0"
          class="mb-4 flex flex-wrap items-center gap-3 bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-3"
        >
          <span class="text-sm font-semibold text-indigo-600 mr-auto">
            <i class="fa-solid fa-check-square mr-1" />
            {{ selectedIds.size }} seleccionado{{ selectedIds.size !== 1 ? 's' : '' }}
          </span>

          <button
            class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-100 text-emerald-700 text-sm font-medium hover:bg-emerald-200 transition-colors disabled:opacity-50"
            :disabled="loading"
            @click="recoverSelected"
          >
            <i class="fa-solid fa-rotate-left" />
            Recuperar seleccionados
          </button>

          <button
            class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-100 text-red-700 text-sm font-medium hover:bg-red-200 transition-colors disabled:opacity-50"
            :disabled="loading"
            @click="confirmDeleteSelected"
          >
            <i class="fa-solid fa-trash-can" />
            Eliminar definitivamente
          </button>

          <button
            class="text-xs text-gray-400 hover:text-gray-600 transition-colors px-2 py-1 rounded"
            @click="clearSelection"
          >
            <i class="fa-solid fa-xmark mr-1" />Deseleccionar
          </button>
        </div>
      </transition>

      <!-- Loading skeleton -->
      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <div v-for="n in 6" :key="n" class="h-16 rounded-xl bg-gray-200 animate-pulse" />
      </div>

      <!-- Empty state -->
      <div
        v-else-if="totalItems === 0"
        class="flex flex-col items-center justify-center py-24 text-gray-400 animate__animated animate__fadeIn"
      >
        <i class="fa-solid fa-trash-can text-6xl mb-4 text-gray-300" />
        <h2 class="text-xl font-semibold text-gray-500 mb-1">La papelera está vacía</h2>
        <p class="text-sm">Los elementos eliminados aparecerán aquí.</p>
      </div>

      <template v-else>

        <!-- Select all -->
        <div class="mb-4">
          <label class="inline-flex items-center gap-2 text-sm font-medium text-gray-600 cursor-pointer select-none">
            <input
              type="checkbox"
              class="w-4 h-4 rounded accent-indigo-600 cursor-pointer"
              :checked="allSelected"
              :indeterminate="someSelected"
              @change="toggleSelectAll"
            />
            Seleccionar todo
          </label>
        </div>

        <!-- Folders -->
        <section v-if="folders.length > 0" class="mb-6">
          <h2 class="flex items-center gap-2 text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
            <i class="fa-solid fa-folder text-amber-400" />
            Carpetas
            <span class="bg-gray-200 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full">
              {{ folders.length }}
            </span>
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <button
              v-for="folder in folders"
              :key="'folder-' + folder.id"
              class="group relative flex items-center gap-3 px-4 py-3 bg-white rounded-xl border-2 cursor-pointer transition-all duration-150"
              :class="selectedIds.has('folder-' + folder.id)
                ? 'border-indigo-400 bg-indigo-50 shadow-sm shadow-indigo-100'
                : 'border-gray-100 hover:border-indigo-200 hover:shadow-sm'"
              @click="toggleSelect('folder-' + folder.id)"
            >
              <label for="folder-{{ folder.id }}"></label>
              <input
                type="checkbox"
                class="w-4 h-4 rounded accent-indigo-600 cursor-pointer flex-shrink-0"
                :checked="selectedIds.has('folder-' + folder.id)"
                @click.stop
                @change="toggleSelect('folder-' + folder.id)"
              />
              <div class="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                <i class="fa-solid fa-folder text-amber-400 text-lg" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-800 truncate">{{ folder.name }}</p>
                <p class="text-xs text-gray-400">{{ formatDate(folder.updated) }}</p>
              </div>
              <div
                class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex-shrink-0"
                :class="{ 'opacity-100': selectedIds.has('folder-' + folder.id) }"
                @click.stop
              >
                <button
                  class="w-8 h-8 flex items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors disabled:opacity-40"
                  title="Recuperar"
                  :disabled="loading"
                  @click="recoverItem('folder', folder.id)"
                >
                  <i class="fa-solid fa-rotate-left text-sm" />
                </button>
                <button
                  class="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors disabled:opacity-40"
                  title="Eliminar definitivamente"
                  :disabled="loading"
                  @click="confirmDeleteItem('folder', folder.id, folder.name)"
                >
                  <i class="fa-solid fa-trash-can text-sm" />
                </button>
              </div>
            </button>
          </div>
        </section>

        <!-- Files -->
        <section v-if="files.length > 0">
          <h2 class="flex items-center gap-2 text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
            <i class="fa-solid fa-file text-blue-400" />
            Archivos
            <span class="bg-gray-200 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full">
              {{ files.length }}
            </span>
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <button
              v-for="file in files"
              :key="'file-' + file.id"
              class="group relative flex items-center gap-3 px-4 py-3 bg-white rounded-xl border-2 cursor-pointer transition-all duration-150"
              :class="selectedIds.has('file-' + file.id)
                ? 'border-indigo-400 bg-indigo-50 shadow-sm shadow-indigo-100'
                : 'border-gray-100 hover:border-indigo-200 hover:shadow-sm'"
              @click="toggleSelect('file-' + file.id)"
            >
              <label for="file-{{ file.id }}"></label>
              <input
                type="checkbox"
                class="w-4 h-4 rounded accent-indigo-600 cursor-pointer flex-shrink-0"
                :checked="selectedIds.has('file-' + file.id)"
                @click.stop
                @change="toggleSelect('file-' + file.id)"
              />
              <div class="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                <i class="fa-solid fa-file text-blue-400 text-lg" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-800 truncate">{{ file.name }}</p>
                <p class="text-xs text-gray-400">{{ formatDate(file.updated) }}</p>
              </div>
              <div
                class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex-shrink-0"
                :class="{ 'opacity-100': selectedIds.has('file-' + file.id) }"
                @click.stop
              >
                <button
                  class="w-8 h-8 flex items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors disabled:opacity-40"
                  title="Recuperar"
                  :disabled="loading"
                  @click="recoverItem('file', file.id)"
                >
                  <i class="fa-solid fa-rotate-left text-sm" />
                </button>
                <button
                  class="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors disabled:opacity-40"
                  title="Eliminar definitivamente"
                  :disabled="loading"
                  @click="confirmDeleteItem('file', file.id, file.name)"
                >
                  <i class="fa-solid fa-trash-can text-sm" />
                </button>
              </div>
            </button>
          </div>
        </section>

      </template>
    </div>

    <!-- Confirm delete modal -->
    <transition
      enter-active-class="animate__animated animate__fadeIn animate__faster"
      leave-active-class="animate__animated animate__fadeOut animate__faster"
    >
      <button
        v-if="confirmDialog.visible"
        class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
        @click.self="confirmDialog.visible = false"
      >
        <div class="animate__animated animate__zoomIn animate__faster bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center">
          <div class="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <i class="fa-solid fa-triangle-exclamation text-red-500 text-2xl" />
          </div>
          <h3 class="text-lg font-bold text-gray-800 mb-2">Eliminar definitivamente</h3>
          <p class="text-sm text-gray-600 mb-1">
            <template v-if="confirmDialog.isBulk">
              ¿Eliminar definitivamente los
              <span class="font-semibold">{{ selectedIds.size }} elementos</span> seleccionados?
            </template>
            <template v-else>
              ¿Eliminar definitivamente
              <span class="font-semibold">"{{ confirmDialog.name }}"</span>?
            </template>
          </p>
          <p class="text-xs text-red-500 font-medium mb-6">
            <i class="fa-solid fa-circle-exclamation mr-1" />
            Esta acción no se puede deshacer.
          </p>
          <div class="flex gap-3 justify-center">
            <button
              class="px-5 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors"
              @click="confirmDialog.visible = false"
            >
              Cancelar
            </button>
            <button
              class="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
              :disabled="loading"
              @click="executeDelete"
            >
              <i class="fa-solid fa-trash-can" />
              {{ loading ? 'Eliminando...' : 'Eliminar' }}
            </button>
          </div>
        </div>
      </button>
    </transition>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  onMounted,
  reactive,
  ref,
} from 'vue';
import { useStore } from 'vuex';
import moment from 'moment';

import { FolderI, FoldersResultI } from '@/store/folders/state';
import { FilesResultI } from '@/store/files/state';

const store = useStore();

const loading = ref(false);
const selectedIds = ref<Set<string>>(new Set());

const confirmDialog = reactive({
  visible: false,
  isBulk: false,
  type: '' as 'folder' | 'file' | '',
  id: null as number | null,
  name: '',
});

const trashFolder = computed<FolderI>(() => store.state.folders.trashFolder);
const folderResults = computed<FoldersResultI>(() => store.state.folders.result);
const fileResults = computed<FilesResultI>(() => store.state.files.result);

const folders = computed<FolderI[]>(() => folderResults.value?.data ?? []);
const files = computed(() => fileResults.value?.data ?? []);
const totalItems = computed(() => folders.value.length + files.value.length);

const allIds = computed(() => [
  ...folders.value.map((f: FolderI) => `folder-${f.id}`),
  ...files.value.map((f: any) => `file-${f.id}`),
]);
const allSelected = computed(
  () => allIds.value.length > 0 && allIds.value.every((id: string) => selectedIds.value.has(id)),
);
const someSelected = computed(
  () => !allSelected.value && allIds.value.some((id: string) => selectedIds.value.has(id)),
);

function toggleSelect(id: string) {
  const next = new Set(selectedIds.value);
  if (next.has(id)) {
    next.delete(id);
  } else {
    next.add(id);
  }
  selectedIds.value = next;
}

function toggleSelectAll() {
  selectedIds.value = allSelected.value ? new Set() : new Set(allIds.value);
}

function clearSelection() {
  selectedIds.value = new Set();
}

function formatDate(date: number) {
  return moment(date * 1000).fromNow();
}

function notify(type: 'success' | 'error', message: string) {
  store.commit('notifications/addNotification', { type, message });
}

async function getTrashFolder() {
  loading.value = true;
  try {
    await store.dispatch('folders/getTrashFolder');
  } catch {
    notify('error', 'Error al obtener la papelera');
  } finally {
    loading.value = false;
  }
}

async function getFolders() {
  loading.value = true;
  try {
    await store.dispatch('folders/filter', { query: '', page: 1, folderId: trashFolder.value.id });
  } catch {
    notify('error', 'Error al obtener las carpetas');
  } finally {
    loading.value = false;
  }
}

async function getFiles() {
  loading.value = true;
  try {
    await store.dispatch('files/filter', { query: '', page: 1, folderId: trashFolder.value.id });
  } catch {
    notify('error', 'Error al obtener los archivos');
  } finally {
    loading.value = false;
  }
}

async function refresh() {
  await getFolders();
  await getFiles();
}

async function recoverItem(type: 'folder' | 'file', id: string | number) {
  loading.value = true;
  try {
    await store.dispatch(`${type}s/recover`, { id });
    notify('success', 'Elemento recuperado correctamente');
    await refresh();
  } catch {
    notify('error', 'Error al recuperar el elemento');
  } finally {
    loading.value = false;
  }
}

async function recoverSelected() {
  loading.value = true;
  try {
    await Promise.all(
      [...selectedIds.value].map((cid: string) => {
        const [type, id] = cid.split('-');
        return store.dispatch(`${type}s/recover`, { id: Number(id) });
      }),
    );
    notify('success', 'Elementos recuperados correctamente');
    clearSelection();
    await refresh();
  } catch {
    notify('error', 'Error al recuperar los elementos');
  } finally {
    loading.value = false;
  }
}

function confirmDeleteItem(type: 'folder' | 'file', id: string | number, name: string) {
  Object.assign(
    confirmDialog,
    {
      isBulk: false,
      type,
      id,
      name,
      visible: true,
    },
  );
}

function confirmDeleteSelected() {
  Object.assign(confirmDialog, { isBulk: true, visible: true });
}

async function executeDelete() {
  loading.value = true;
  try {
    if (confirmDialog.isBulk) {
      await Promise.all(
        [...selectedIds.value].map((cid: string) => {
          const [type, id] = cid.split('-');
          return store.dispatch(`${type}s/deletePermanently`, { id: Number(id) });
        }),
      );
      notify('success', 'Elementos eliminados definitivamente');
      clearSelection();
    } else {
      await store.dispatch(`${confirmDialog.type}s/deletePermanently`, { id: confirmDialog.id });
      notify('success', 'Elemento eliminado definitivamente');
    }
    confirmDialog.visible = false;
    await refresh();
  } catch {
    notify('error', 'Error al eliminar el elemento');
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  await getTrashFolder();
  await getFolders();
  await getFiles();
});
</script>
