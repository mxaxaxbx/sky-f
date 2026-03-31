<template>
  <!-- loading -->
  <div v-if="loading" class="flex mx-auto justify-center items-center py-20 mt-10 text-[var(--color-primary)]">
    <i class="fas fa-spinner fa-spin text-2xl"></i>
  </div>

  <!-- empty state -->
  <div v-else-if="!folders.length && !files.length" class="px-8 mx-auto w-full h-full mt-4">
    <div
      class="
        flex flex-col gap-6 justify-center items-center
        w-full h-[calc(100vh-120px)]
        border-2 border-[var(--text-terceary)] border-dashed
        rounded-2xl
        hover:border-[var(--color-primary)]
        transition-colors duration-300
      "
    >
      <i class="fas fa-trash-can text-6xl text-[var(--text-terceary)]"></i>
      <p class="text-[var(--text-terceary)] text-center text-2xl font-regular">
        The void is empty. Nothing to delete here.
      </p>
    </div>
  </div>

  <template v-else>
    <div class="mt-10 border border-transparent">
      <h1 class="
          text-lg text-[var(--text)]
          font-alexandria font-semibold
          mx-2 my-2 mt-14
          px-2

          sm:mt-8 sm:px-12
          sm:text-xl
        "
      >
        Event Horizon
      </h1>
    <p class="
        mx-2 mt-4 px-2
        text-sm text-[var(--text-terceary)] font-light

        sm:px-12 sm:mt-8
      "
    >
      Deleted files don’t disappear right away: you have 30 days to restore them.
      Then they’re permanently removed. {{ showDeleteModal }}
    </p>

    <!-- bulk actions bar -->
    <transition name="soft">
      <div
        v-if="selectedFiles.length || selectedFolders.length"
        class="
          flex items-center justify-between gap-4
          mt-4 px-2 py-3
          border-b border-[var(--border)]

          sm:px-14 sm:mt-8 sm:gap-12
          sm:items-center sm:justify-start

        "
      >
        <div class="flex  items-center gap-1 sm:gap-2">
          <span class="
            text-sm font-medium text-[var(--text)]
            mr-auto

            sm:text-lg
            "
          >
            {{ selectedFiles.length + selectedFolders.length }} <span class="ml-1">selected:</span>
          </span>
          <!-- clear selection -->
          <button
            @click="clearSelection"
            class="
              text-s text-[var(--text-terceary)]
              rounded-xl border border-transparent p-1

              hover:border-[var(--color-primary)] hover:text-[var(--text)]
              hover:bg-[var(--hover-bg)]
              hover:shadow-[0_0_5px_2px_rgba(10,119,243,0.3)]
              transition-colors duration-300
            "
          >
            <i class="fas fa-xmark h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>

        <div class="flex gap-2">
          <!-- recover selected -->
          <button
            :disabled="loading"
            @click="recoverSelected"
            class="
              flex items-center
              px-1 py-1 gap-2
              text-sm font-medium
              rounded-xl border
              text-[var(--color-primary)]
              border-[var(--color-primary)]
              bg-[var(--bg-secondary)]
              grayscale

              hover:border-[var(--color-primary)]
              hover:bg-[var(--hover-bg)]
              hover:opacity-100 hover:grayscale-0
              hover:shadow-[0_0_5px_3px_rgba(10,119,243,0.3)]
              focus:grayscale-0 focus:opacity-100
              transition-all duration-300

              sm:px-2
            "
          >
            <img src="/icon/icon-recover.svg" alt="recover" class="h-5" />
            <span class="hidden sm:inline">Recover</span>
          </button>

          <!-- delete selected -->
          <button
            :disabled="loading"
            @click="showDeleteModal = true"
            class="
              btn-delete
              flex items-center
              px-2 py-1 gap-2
              text-sm font-medium
              rounded-xl border
              text-[var(--delete-color)]
              border-[var(--delete-color)]
              bg-[var(--bg-secondary)]
              grayscale opacity-60

              hover:border-[var(--delete-color)]
              hover:bg-[var(--delete-bg)]
              hover:opacity-100 hover:grayscale-0
              focus:grayscale-0 focus:opacity-100
              transition-all duration-300
              disabled:opacity-40

              sm:px-2 sm:gap-2
              sm:text-sm
            "
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5">
              <mask id="mask0_1676_2" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                <rect width="24" height="24" fill="#FFC506"/>
              </mask>
              <g mask="url(#mask0_1676_2)">
                <path d="M12 2C14.4189 2 16.4361 3.71782 16.8994 6H22V8H20V17C20 19.7614 17.7614 22 15 22H9C6.23858 22 4 19.7614 4 17V8H2V6H7.10059C7.5639
                  3.71782 9.58108 2 12 2ZM6 17C6 18.6569 7.34315 20 9 20H15C16.6569 20 18 18.6569 18 17V8H6V17ZM11 18H9V10H11V18ZM15 18H13V10H15V18ZM12
                  4C10.6941 4 9.58594 4.83532 9.17383 6H14.8262C14.4141 4.83532 13.3059 4 12 4Z" fill="var(--delete-color)"/>
              </g>
            </svg>
            Delete permanently
          </button>
        </div>
      </div>
    </transition>

    <!-- folders section -->
    <div
      v-if="folders.length"
      class="
        w-full
        border-b border-[var(--border)]
        py-0 px-2 pt-4

        sm:py-4 sm:px-14
      "
    >
      <h3
        class="
          flex items-center
          font-regular text-left text-md text-[var(--text-terceary)] truncate
          mb-1 gap-2 mx-2

          sm:text-lg sm:mb-0 sm:font-semibold
        "
      >
        <span>Folders</span>
        <button
          type="button"
          @click="showFolders = !showFolders"
          class="
            text-xs
            p-1 mt-0.5
            border border-transparent
            rounded-xl

            hover:border-[var(--color-primary)]
            hover:text-[var(--color-primary)]
            focus:outline-none
            transition-all duration-300"
          :class="showFolders ? 'text-[var(--color-primary)]' : 'grayscale'"
        >
          <img :src="showFolders ? '/icon/icon-preview.svg' : '/icon/icon-close-eye.svg'" alt="eye icon" class="h-5" />
        </button>
      </h3>

      <Transition name="slide">
        <div
          v-show="showFolders"
          class="
            grid grid-cols-2 gap-2
            text-[var(--text)]
            my-4  mx-0

            sm:gap-4 sm:my-2
            sm:grid-cols-2
            md:grid-cols-3
            lg:grid-cols-4
            xl:grid-cols-6
            transition-all duration-300
          "
        >
          <button
            v-for="folder in folders"
            :key="folder.id"
            @click="toggleSelect(folder, 'folder')"
            class="
              group
              flex items-center justify-between
              w-full
              bg-[var(--bg-secondary)]
              border border-[var(--border)]
              rounded-2xl min-w-0
              cursor-pointer
              hover:bg-[var(--hover-bg)]
              hover:border-[var(--hover-border)]
              transition-all duration-300
            "
            :class="selectedFolders.some((f: FolderI) => f.id === folder.id)
              ? 'border-[var(--color-primary)] bg-[var(--hover-bg)] shadow-[0_0_5px_2px_rgba(10,119,243,0.5)]'
              : 'border-[var(--border)]'
            "
          >
            <div class="flex-1 min-w-0 p-1">
              <div class="flex items-center justify-between">
                <div class="flex items-center min-w-0 w-full overflow-hidden gap-1">
                  <!-- checkbox -->
                  <label for="folder-{{ folder.id }}"></label>
                  <input
                    type="checkbox"
                    :checked="selectedFolders.some((f: FolderI) => f.id === folder.id)"
                    @click.stop
                    @change="toggleSelect(folder, 'folder')"
                    class="w-3.5 h-3.5 rounded accent-[var(--color-primary)] flex-shrink-0 ml-1 cursor-pointer"
                  />
                  <img src="/icon/icon-folder.svg" alt="folder" class="h-10 flex-shrink-0 ml-1" />
                  <div class="flex-1 min-w-0 text-left">
                    <h3 class="font-semibold text-xs sm:text-sm truncate">
                      {{ folder.name }}
                    </h3>
                    <p class="text-[0.6rem] text-[var(--text-terceary)] font-light">
                      {{ formatDate(folder.updated) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- actions -->
            <div
              class="
                flex items-center justify-center
                border-l border-[var(--border)]
                w-6 py-2 h-full
                group-hover:border-[var(--color-primary)]
                transition-colors duration-300
              "
            >
              <Dropdown
                :classes="[
                  'bg-[var(--bg-secondary)]',
                  'border border-[var(--border)]',
                  'rounded-2xl',
                  'absolute', '-right-0', 'z-20',
                  dropdownPosition,
                  'w-52',
                  'sm:-right-2'
                ]"
              >
                <template #trigger="{ toggle, close }">
                  <button
                    @click="toggleDropdown(toggle, close, $event)"
                    class="
                      text-[var(--text-terceary)] w-6 h-auto
                      hover:text-[var(--text)]
                      transition-colors duration-300
                    "
                  >
                    <i class="fas fa-ellipsis-v"></i>
                  </button>
                </template>

                <template #content>
                  <div class="flex flex-col gap-1 px-1 py-1 font-regular text-sm text-[#868686]">

                    <!-- recover -->
                    <button
                      @click.stop="recoverItem('folder', folder)"
                      :disabled="loading"
                      class="
                        flex items-center gap-4
                        px-3 py-1
                        text-sm font-medium
                        rounded-xl border
                        text-[var(--color-primary)]
                        border-transparent
                        bg-[var(--bg-secondary)]
                        grayscale

                        hover:border-[var(--color-primary)]
                        hover:bg-[var(--hover-bg)]
                        hover:opacity-100 hover:grayscale-0
                        hover:shadow-[0_0_5px_2px_rgba(10,119,243,0.3)]
                        focus:grayscale-0 focus:opacity-100
                        transition-all duration-300
                        disabled:opacity-40
                      "
                    >
                    <img src="/icon/icon-recover.svg" alt="recover" class="h-5" />
                      Recover
                    </button>

                    <!-- delete permanently -->
                    <button
                      @click.stop.prevent="showDeleteModal = true"
                      :disabled="loading"
                      class="
                          btn-delete
                          flex items-center gap-4
                          px-3 py-1
                          text-sm font-medium
                          rounded-xl border
                          text-[var(--delete-color)]
                          border-transparent
                          bg-[var(--bg-secondary)]
                          grayscale opacity-60

                          hover:border-[var(--delete-color)]
                          hover:bg-[var(--delete-bg)]
                          hover:opacity-100 hover:grayscale-0
                          focus:grayscale-0 focus:opacity-100
                          transition-all duration-300
                          disabled:opacity-40
                        "
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5">
                          <mask id="mask0_1676_2" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                            <rect width="24" height="24" fill="#FFC506"/>
                          </mask>
                          <g mask="url(#mask0_1676_2)">
                            <path d="M12 2C14.4189 2 16.4361 3.71782 16.8994 6H22V8H20V17C20 19.7614 17.7614 22 15 22H9C6.23858 22 4 19.7614 4 17V8H2V6H7.10059C7.5639
                              3.71782 9.58108 2 12 2ZM6 17C6 18.6569 7.34315 20 9 20H15C16.6569 20 18 18.6569 18 17V8H6V17ZM11 18H9V10H11V18ZM15 18H13V10H15V18ZM12
                              4C10.6941 4 9.58594 4.83532 9.17383 6H14.8262C14.4141 4.83532 13.3059 4 12 4Z" fill="var(--delete-color)"/>
                          </g>
                        </svg>
                        Delete permanently
                      </button>

                  </div>
                </template>
              </Dropdown>
            </div>
          </button>
        </div>
      </Transition>
    </div>

    <!-- files section -->
    <div
      v-if="files.length"
      class="w-full py-6 px-2 pt-4 sm:mt-0 sm:py-4 sm:px-14"
    >
      <h3
        class="
          flex items-center
          font-regular text-left text-md text-[var(--text-terceary)] truncate
          mb-1 gap-2 mx-2

          sm:text-lg sm:mb-2 sm:font-semibold
        "
      >
        <span>Your Files</span>
        <button
          type="button"
          @click="showFiles = !showFiles"
          class="
            text-xs rounded-xl p-1 border border-transparent mt-0.5
            hover:border-[var(--color-primary)]
            hover:text-[var(--color-primary)]
            transition-all duration-300"
          :class="showFiles ? 'text-[var(--color-primary)]' : 'grayscale'"
        >
          <img :src="showFiles ? '/icon/icon-preview.svg' : '/icon/icon-close-eye.svg'" alt="eye icon" class="h-5" />
        </button>
      </h3>

      <Transition name="slide">
        <div
          v-show="showFiles"
          class="
            grid grid-cols-1 gap-2
            my-4 mx-0
            text-[var(--text)]

            sm:gap-4 sm:my-2
            sm:grid-cols-2
            md:grid-cols-3
            lg:grid-cols-4
            xl:grid-cols-6
          "
        >
          <button
            v-for="file in files"
            :key="file.id"
            @click="toggleSelect(file, 'file')"
            class="
              group
              flex items-center justify-between
              w-full
              bg-[var(--bg-secondary)]
              border border-[var(--border)]
              rounded-2xl min-w-0
              cursor-pointer
              hover:bg-[var(--hover-bg)]
              hover:border-[var(--hover-border)]
              transition-colors duration-300
            "
            :class="selectedFiles.some((f: FileI) => f.id === file.id)
              ? 'border-[var(--color-primary)] bg-[var(--hover-bg)] shadow-[0_0_5px_2px_rgba(10,119,243,0.3)]'
              : 'border-[var(--border)]'
            "
          >
            <div class="flex w-full h-auto items-center justify-between relative">
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between gap-1">
                  <!-- checkbox -->
                  <div class="h-full ml-3">
                    <label for="file-{{ file.id }}"></label>
                    <input
                      type="checkbox"
                      :checked="selectedFiles.some((f: FileI) => f.id === file.id)"
                      @click.stop
                      @change="toggleSelect(file, 'file')"
                      class="w-3.5 h-3.5 rounded accent-[var(--color-primary)] flex-shrink-0 cursor-pointer mr-1"
                    />
                  </div>
                  <div class="flex items-center gap-1 min-w-0 w-full overflow-hidden h-full">
                    <!-- file type icon -->
                    <img v-if="file.contentType === 'application/pdf'" src="/icon/icon-pdf.svg" alt="pdf" class="h-10 w-10" />
                    <img v-else-if="file.contentType === 'application/msword' || file.contentType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'" src="/icon/icon-doc.svg" alt="doc" class="h-10 w-10" />
                    <img v-else-if="file.contentType === 'application/vnd.ms-excel' || file.contentType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'" src="/icon/icon-excel.svg" alt="excel" class="h-10 w-10" />
                    <img v-else-if="file.contentType === 'application/vnd.ms-powerpoint' || file.contentType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'" src="/icon/icon-ppt.svg" alt="ppt" class="h-10 w-10" />
                    <img v-else-if="/image\/(png|webp|gif|avif)/.test(file.contentType)" src="/icon/icon-png.svg" alt="png" class="h-10 w-10" />
                    <img v-else-if="file.contentType === 'image/svg+xml'" src="/icon/icon-svg.svg" alt="svg" class="h-10 w-10" />
                    <img v-else-if="/image\/(jpeg|jpg|bmp|tiff|heic|heif|x-icon|vnd\.microsoft\.icon)/.test(file.contentType)" src="/icon/icon-img.svg" alt="img" class="h-10 w-10" />
                    <img v-else-if="/^video\//.test(file.contentType)" src="/icon/icon-video.svg" alt="video" class="h-10 w-10" />
                    <img v-else-if="/^audio\//.test(file.contentType)" src="/icon/icon-audio.svg" alt="audio" class="h-10 w-10" />
                    <img v-else-if="
                        file.name?.toLowerCase().endsWith('.zip') ||
                        file.name?.toLowerCase().endsWith('.rar') ||
                        file.name?.toLowerCase().endsWith('.7z') ||
                        file.name?.toLowerCase().endsWith('.tar') ||
                        file.name?.toLowerCase().endsWith('.gz') ||
                        file.name?.toLowerCase().endsWith('.bz2')
                      "
                      src="/icon/icon-compress.svg"
                      alt="compressed file icon"
                      class="h-10 w-10"
                    />
                    <img v-else src="/icon/icon-file.svg" alt="file" class="h-10 w-10" />

                    <!-- name & date -->
                    <div class="flex-1 min-w-0 text-left">
                      <h3 class="font-semibold text-[var(--text)] text-xs sm:text-sm truncate">
                        {{ file.name }}
                      </h3>
                      <p class="text-[0.7rem] text-[var(--text-terceary)] font-light">
                        {{ moment(file.created * 1000).format('DD/MM/YY HH:mm') }} · {{ formatFileSize(file.size) }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- actions -->
              <div
                class="
                  flex items-center justify-center
                  border-l border-[var(--border)]
                  w-6 py-1
                  group-hover:border-[var(--color-primary)]
                  transition-colors duration-300
                "
              >
                <Dropdown
                  :classes="[
                    'bg-[var(--bg-secondary)]',
                    'border border-[var(--border)]',
                    'rounded-2xl',
                    'absolute', '-right-0', 'z-20',
                    dropdownPosition,
                    'w-52',
                    'sm:-right-2'
                  ]"
                >
                <template #trigger="{ toggle, close }">
                    <button
                      @click="toggleDropdown(toggle, close, $event)"
                      class="
                        text-[var(--text-terceary)] w-6 h-10
                        hover:text-[var(--text)]
                        transition-colors duration-300
                      "
                    >
                      <i class="fas fa-ellipsis-v"></i>
                    </button>
                  </template>

                  <template #content>
                    <div class="flex flex-col gap-1 px-1 py-1 font-regular text-sm text-[#868686]">

                      <!-- recover -->
                      <button
                        @click.stop="recoverItem('file', file)"
                        :disabled="loading"
                        class="
                          flex items-center gap-4
                          px-3 py-1
                          text-sm font-medium
                          rounded-xl border
                          text-[var(--color-primary)]
                          border-transparent
                          bg-[var(--bg-secondary)]
                          grayscale

                          hover:border-[var(--color-primary)]
                          hover:bg-[var(--hover-bg)]
                          hover:opacity-100 hover:grayscale-0
                          hover:shadow-[0_0_5px_2px_rgba(10,119,243,0.3)]
                          focus:grayscale-0 focus:opacity-100
                          transition-all duration-300
                          disabled:opacity-40
                        "
                      >
                      <img src="/icon/icon-recover.svg" alt="recover" class="h-5" />
                        Recover
                      </button>

                      <!-- delete permanently -->
                      <button
                        @click.stop="selectedFiles.push(file); showDeleteModal = true"
                        :disabled="loading"
                        class="
                          btn-delete
                          flex items-center gap-4
                          px-3 py-1
                          text-sm font-medium
                          rounded-xl border
                          text-[var(--delete-color)]
                          border-transparent
                          bg-[var(--bg-secondary)]
                          grayscale opacity-60

                          hover:border-[var(--delete-color)]
                          hover:bg-[var(--delete-bg)]
                          hover:opacity-100 hover:grayscale-0
                          focus:grayscale-0 focus:opacity-100
                          transition-all duration-300
                          disabled:opacity-40
                        "
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5">
                          <mask id="mask0_1676_2" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                            <rect width="24" height="24" fill="#FFC506"/>
                          </mask>
                          <g mask="url(#mask0_1676_2)">
                            <path d="M12 2C14.4189 2 16.4361 3.71782 16.8994 6H22V8H20V17C20 19.7614 17.7614 22 15 22H9C6.23858 22 4 19.7614 4 17V8H2V6H7.10059C7.5639
                              3.71782 9.58108 2 12 2ZM6 17C6 18.6569 7.34315 20 9 20H15C16.6569 20 18 18.6569 18 17V8H6V17ZM11 18H9V10H11V18ZM15 18H13V10H15V18ZM12
                              4C10.6941 4 9.58594 4.83532 9.17383 6H14.8262C14.4141 4.83532 13.3059 4 12 4Z" fill="var(--delete-color)"/>
                          </g>
                        </svg>
                        Delete permanently
                      </button>
                    </div>
                  </template>
                </Dropdown>
              </div>
            </div>
          </button>
        </div>
      </Transition>
    </div>

    </div>
  </template>

  <!-- confirm delete modal -->
  <Modal v-model="showDeleteModal" size="xl">
    <template #header>
      <div class="flex items-center mb-1">
        <h3 class="text-lg font-medium text-[var(--delete-color)] flex items-center gap-2">
          <img src="/icon/icon-delate-red.svg" alt="warning" class="h-6" />
          Delete permanently
        </h3>
      </div>
    </template>

    <template #content>
      <p class="text-[var(--text-terceary)] text-base my-2 px-4">
        <template v-if="selectedFiles.length + selectedFolders.length > 25">
          Are you sure you want to permanently delete
          <span class="font-semibold text-[var(--text)]">{{ selectedFiles.length + selectedFolders.length }} items </span>?
        </template>
        <template v-else>
          Are you sure you want to permanently delete the following items
          <div class="my-4">
          <div v-if="selectedFolders.length" class="my-2">
          <span class="text-base text-[var(--text)] font-normal">Folder ({{selectedFolders.length}})</span>
          <ul class="grid grid-cols-2 list-disc list-inside mt-2 ml-2 font-light text-[var(--text-terceary)] text-sm">
            <li v-for="folder in selectedFolders" :key="folder.id" class="ml-2">
              {{ folder.name }}
            </li>
          </ul>
        </div>
        <div v-if="selectedFiles.length" class="my-2">
          <span class="text-base text-[var(--text)] font-normal">Files ({{selectedFiles.length}})</span>
          <ul class=" grid grid-cols-2 list-disc list-inside mt-2 ml-2 font-light text-[var(--text-terceary)] text-sm">
            <li v-for="file in selectedFiles" :key="file.id" class="ml-2 truncate">
              {{ file.name }}
            </li>
          </ul>
        </div>
      </div>
        </template>
      </p>
      <p class="text-md text-[var(--delete-color)] font-medium gap-2 mx-4 mt-6">
        This action cannot be undone.
      </p>
    </template>

    <template #footer>
      <button
        type="button"
        @click="showDeleteModal = false"
        class="
          text-[var(--text-secondary)] text-sm
          border border-[var(--border)] bg-[var(--bg)]
          rounded-full
          px-3

          hover:border-[var(--text)]
          hover:bg-[var(--hover-bg-gray)]
          hover:text-[var(--text)]
        "
      >
        Cancel
      </button>
      <button
        @click="executeDelete"
        :disabled="loading"
        class="
          btn-delete
          flex items-center gap-2
          px-2.5 py-0.5
          text-sm font-medium
          rounded-full border
          text-[var(--delete-color)]
          border-[var(--delete-color)]
          bg-[var(--bg-secondary)]
          opacity-70

          hover:border-[var(--delete-color)]
          hover:bg-[var(--delete-bg)]
          hover:opacity-100 hover:grayscale-0
          focus:grayscale-0 focus:opacity-100
          transition-all duration-300
          disabled:opacity-40
        "
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5">
          <mask id="mask0_1676_2" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
            <rect width="24" height="24" fill="#FFC506"/>
          </mask>
          <g mask="url(#mask0_1676_2)">
            <path d="M12 2C14.4189 2 16.4361 3.71782 16.8994 6H22V8H20V17C20 19.7614 17.7614 22 15 22H9C6.23858 22 4 19.7614 4 17V8H2V6H7.10059C7.5639
              3.71782 9.58108 2 12 2ZM6 17C6 18.6569 7.34315 20 9 20H15C16.6569 20 18 18.6569 18 17V8H6V17ZM11 18H9V10H11V18ZM15 18H13V10H15V18ZM12
              4C10.6941 4 9.58594 4.83532 9.17383 6H14.8262C14.4141 4.83532 13.3059 4 12 4Z" fill="var(--delete-color)"/>
          </g>
        </svg>
        {{ loading ? 'Deleting...' : 'Delete permanently' }}
      </button>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import {
  computed,
  onMounted,
  reactive,
  ref,
  nextTick,
  defineAsyncComponent,
} from 'vue';
import { useStore } from 'vuex';
import moment from 'moment';

import { FolderI, FoldersResultI } from '@/store/folders/state';
import { FileI, FilesResultI } from '@/store/files/state';

const Modal = defineAsyncComponent(() => import('@/components/global/modal.vue'));
const Dropdown = defineAsyncComponent(() => import('@/components/global/dropdown.vue'));

const store = useStore();

const loading = ref(false);
const showFolders = ref(true);
const showFiles = ref(true);
const selectedFiles = ref<FileI[]>([]);
const selectedFolders = ref<FolderI[]>([]);
const dropdownPosition = ref('top-8');
const activeDropdown = ref<(() => void) | null>(null);

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
const showDeleteModal = ref(false);

function toggleSelect(item: FileI | FolderI, type: 'file' | 'folder') {
  if (type === 'file') {
    const index = selectedFiles.value.findIndex((f) => f.id === item.id);

    if (index >= 0) {
      // deseleccionar
      selectedFiles.value.splice(index, 1);
    } else {
      // seleccionar
      selectedFiles.value.push(item as FileI);
    }
  }

  if (type === 'folder') {
    const index = selectedFolders.value.findIndex((f) => f.id === item.id);

    if (index >= 0) {
      selectedFolders.value.splice(index, 1);
    } else {
      selectedFolders.value.push(item as FolderI);
    }
  }
}

function clearSelection() {
  selectedFiles.value = [];
  selectedFolders.value = [];
}

function formatDate(date: number) {
  return moment(date * 1000).fromNow();
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

const toggleDropdown = async (
  toggle: () => void,
  close: () => void,
  event?: MouseEvent,
) => {
  if (event) event.stopPropagation();

  if (activeDropdown.value && activeDropdown.value !== close) {
    activeDropdown.value();
  }

  activeDropdown.value = close;
  toggle();

  await nextTick();
  const middle = window.innerHeight / 2;
  const y = event?.clientY || 0;
  dropdownPosition.value = y > middle ? 'bottom-8' : 'top-8';
};
function notify(type: 'success' | 'error', message: string) {
  store.commit('notifications/addNotification', { type, message });
}

async function getTrashFolder() {
  loading.value = true;
  try {
    await store.dispatch('folders/getTrashFolder');
  } catch {
    notify('error', 'Error getting the trash folder');
  } finally {
    loading.value = false;
  }
}

async function getFolders() {
  loading.value = true;
  try {
    await store.dispatch('folders/filter', { query: '', page: 1, folderId: trashFolder.value.id });
  } catch {
    notify('error', 'Error getting folders');
  } finally {
    loading.value = false;
  }
}

async function getFiles() {
  loading.value = true;
  try {
    await store.dispatch('files/filter', { query: '', page: 1, folderId: trashFolder.value.id });
  } catch {
    notify('error', 'Error getting files');
  } finally {
    loading.value = false;
  }
}

async function refresh() {
  await getFolders();
  await getFiles();
}

async function recoverItem(type: 'folder' | 'file', item: FileI | FolderI) {
  loading.value = true;
  try {
    if (type === 'folder') {
      await store.dispatch('folders/restoreFolders', [item as FolderI]);
    } else if (type === 'file') {
      await store.dispatch('files/restoreFiles', [item as FileI]);
    }
    notify('success', 'Item recovered successfully');
    await refresh();
  } catch {
    notify('error', 'Error recovering item');
  } finally {
    loading.value = false;
  }
}

async function recoverSelected() {
  loading.value = true;
  try {
    if (selectedFiles.value.length) {
      await store.dispatch('files/restoreFiles', selectedFiles.value);
    }

    if (selectedFolders.value.length) {
      await store.dispatch('folders/restoreFolders', selectedFolders.value);
    }

    notify('success', 'Items recovered successfully');
    clearSelection();
    await refresh();
  } catch {
    notify('error', 'Error recovering items');
  } finally {
    loading.value = false;
  }
}

async function executeDelete() {
  loading.value = true;
  try {
    if (selectedFolders.value.length) {
      await store.dispatch('folders/removeFoldersFromTrash', selectedFolders.value);
    }
    if (selectedFiles.value.length) {
      await store.dispatch('files/removeFilesFromTrash', selectedFiles.value);
    }

    notify('success', 'Items permanently deleted');
    clearSelection();
    showDeleteModal.value = false;
    await refresh();
  } catch {
    notify('error', 'Error deleting items');
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
<style scoped>
.soft-enter-active {
  transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}

.soft-leave-active {
  transition: all 0.2s ease;
}

.soft-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}

.soft-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.soft-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
.btn-delete:hover {
  box-shadow: var(--delete-shadow);
}
</style>
