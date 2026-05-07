<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="
        fixed z-50
        bg-[var(--bg-modal-2)]
        backdrop-blur-md
        border border-[var(--border)]
        rounded-2xl shadow-md
        w-48
        flex flex-col font-regular text-sm text-[#868686]
      "
      :style="{ top: y + 'px', left: x + 'px' }"
      @click.stop
      @contextmenu.prevent
    >
      <!-- Single File actions -->
      <template v-if="totalSelected === 1 && selectedFiles.length === 1">
        <div class="border-b border-[var(--border)] p-1 space-y-1">
          <button @click="emitAction('info')" class="menu-btn">
            <img src="/icon/icon_details.svg" alt="details" class="menu-icon" />
            <span>info</span>
          </button>
          <button @click="emitAction('rename-file')" class="menu-btn">
            <img src="/icon/icon-edit.svg" alt="edit" class="menu-icon" />
            <span>Rename</span>
          </button>
        </div>

        <div class="border-b border-[var(--border)] p-1 space-y-1">
          <button @click="emitAction('preview')" class="menu-btn">
            <img src="/icon/icon-preview.svg" alt="preview" class="menu-icon" />
            <span>Preview</span>
          </button>
          <button @click="emitAction('download')" class="menu-btn grayscale hover:grayscale-0 hover:text-[var(--color-primary)]">
            <img src="/icon/icon_download_2.svg" alt="download" class="h-5 mr-4" />
            <span>Download</span>
          </button>
        </div>

        <div class="border-b border-[var(--border)] p-1 space-y-1">
          <button @click="emitAction('move')" class="menu-btn">
            <img src="/icon/icon_move.svg" alt="move" class="menu-icon" />
            <span>Move to folder</span>
          </button>
          <button @click="emitAction('copy-link')" class="menu-btn">
            <img src="/icon/icon-link.svg" alt="link" class="menu-icon -rotate-45" />
            <span>Copy link</span>
          </button>
        </div>
      </template>

      <!-- Single Folder actions -->
      <template v-else-if="totalSelected === 1 && selectedFolders.length === 1">
        <div class="border-b border-[var(--border)] p-1 space-y-1">
          <button @click="emitAction('rename-folder')" class="menu-btn">
            <img src="/icon/icon-edit.svg" alt="edit" class="menu-icon" />
            <span>Rename</span>
          </button>
        </div>
        <div class="border-b border-[var(--border)] p-1 space-y-1">
          <button @click="emitAction('move')" class="menu-btn">
            <img src="/icon/icon_move.svg" alt="move" class="menu-icon" />
            <span>Move to folder</span>
          </button>
        </div>
      </template>

      <!-- Multi-select actions -->
      <template v-else-if="totalSelected > 1">
        <div class="border-b border-[var(--border)] p-1 space-y-1">
          <button @click="emitAction('move')" class="menu-btn">
            <img src="/icon/icon_move.svg" alt="move" class="menu-icon" />
            <span>Move to folder</span>
          </button>
          <button v-if="selectedFiles.length > 0" @click="emitAction('download-selected')" class="menu-btn grayscale hover:grayscale-0 hover:text-[var(--color-primary)]">
            <img src="/icon/icon_download_2.svg" alt="download" class="h-5 mr-4" />
            <span>Download</span>
          </button>
        </div>
      </template>

      <!-- Global actions (no items selected) -->
      <template v-else>
        <div class="p-1 space-y-1 font-regular text-md">
          <button @click="emitAction('upload')" class="menu-btn text-[var(--text)] opacity-50 hover:opacity-100">
            <img src="/icon/icon-upload.svg" alt="upload" class="menu-icon h-4 mr-4" />
            <span>Upload files</span>
          </button>
          <button @click="emitAction('create-folder')" class="menu-btn">
            <img src="/icon/icon-new-folder.svg" alt="new folder" class="menu-icon h-5 mr-4" />
            <span>Create folder</span>
          </button>
        </div>
      </template>

      <!-- Final Section: Send to the Void -->
      <div class="p-1" v-if="totalSelected > 0">
        <button
          @click="emitAction('trash')"
          class="
            flex items-center justify-start w-full
            rounded-xl px-3 py-1 border border-transparent
            grayscale text-[var(--delete-color)] opacity-60
            hover:bg-[var(--delete-bg)]
            hover:text-[var(--delete-color)]
            hover:border-[var(--delete-color)]
            hover:grayscale-0 hover:opacity-100
            transition-colors duration-300
          "
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3">
            <mask id="mask_ctx_delete" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
              <rect width="24" height="24" fill="#FFC506"/>
            </mask>
            <g mask="url(#mask_ctx_delete)">
              <path d="M12 2C14.4189 2 16.4361 3.71782 16.8994 6H22V8H20V17C20 19.7614 17.7614 22 15 22H9C6.23858 22 4 19.7614 4 17V8H2V6H7.10059C7.5639 3.71782 9.58108 2 12 2ZM6 17C6 18.6569 7.34315 20 9 20H15C16.6569 20 18 18.6569 18 17V8H6V17ZM11 18H9V10H11V18ZM15 18H13V10H15V18ZM12 4C10.6941 4 9.58594 4.83532 9.17383 6H14.8262C14.4141 4.83532 13.3059 4 12 4Z" fill="var(--delete-color)"/>
            </g>
          </svg>
          <span>Send to the Void</span>
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, defineProps, defineEmits } from 'vue';
import { FileI } from '@/store/files/state';
import { FolderI } from '@/store/folders/state';

const props = defineProps<{
  modelValue: boolean;
  x: number;
  y: number;
  selectedFiles: FileI[];
  selectedFolders: FolderI[];
}>();

const emit = defineEmits(['update:modelValue', 'action']);

const totalSelected = computed(() => props.selectedFiles.length + props.selectedFolders.length);

const emitAction = (action: string) => {
  emit('action', action);
  emit('update:modelValue', false);
};
</script>

<style scoped>
.menu-btn {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  border-radius: 0.75rem; /* 12px */
  padding: 0.25rem 0.75rem;
  border: 1px solid transparent;
  transition: all 0.300s;
  cursor: pointer;
  background: transparent;
}

.menu-btn:hover {
  background-color: var(--hover-bg);
  border-color: var(--color-primary);
}

.menu-icon {
  height: 1.25rem; /* 20px */
  margin-right: 1rem; /* 16px */
  filter: grayscale(100%);
}
</style>
