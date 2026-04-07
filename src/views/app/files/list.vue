<template>
  <div
    class="w-full h-full focus:outline-none"
    @click="handleContainerClick"
    @keydown.enter="handleContainerClick"
    tabindex="0"
  >
    <h1
      class="
        text-xl text-[var(--text)] font-semibold
        mx-2 my-2 px-12 font-alexandria

        sm:mt-6
        hidden sm:block
      "
    >
      Could Drive
    </h1>
    <h1 class="
      text-left text-lg font-semibold
      text-[var(--text)]
      mx-4 mt-14 sm:hidden block">
      Could Drive
    </h1>

    <!-- loading -->
    <div v-if="loading" class="flex justify-center items-center text-[var(--color-primary)]">
      <i class="fas fa-spinner fa-spin text-2xl"></i>
    </div>

    <!-- if not results -->
    <div v-else-if="!fileResults.data.length && !folderResults.data.length"
      class="flex items center px-0 mx-auto w-full mt-4 sm:px-8">
      <div
        class="
          group
          flex flex-col gap-8 justify-center items-center
          w-full h-[calc(100vh-170px)] ml-2 mx-2 px-4
          border-2 border-[var(--border)] border-dashed
          rounded-2xl

          hover:border-[var(--color-primary)]
          hover:shadow-[0_0_8px_2px_rgba(10,119,243,0.5)]
          transition-colors duration-300
          "
      >
        <svg width="300" height="260" viewBox="0 0 220 260" fill="#fffff" xmlns="http://www.w3.org/2000/svg">
          <!-- luz -->
          <g class="lights">
          <ellipse cx="96.6104" cy="224.696" rx="79.5" ry="14.5" fill="var(--bg-path-secondary)" fill-opacity="0.2"/>
          <path d="M176.109 223.755C176.109 232.283 140.516 239.196 96.6094 239.196C52.7027 239.196 17.1094 232.283 17.1094 223.755C17.1094 216.703 48 89.201 48 89.201C48 89.201 86.8023 89.1963 94.401 89.1963C102 89.1963 141.5 86.1963 141.5 86.1963C141.5 86.1963 176.109 216.703 176.109 223.755Z"
            fill="var(--sun)" fill-opacity="0.5"/>
          </g>
          <!-- nave espacial -->
          <g class="spacesship">
          <path d="M92.6311 34.3746C117.232 31.7957 139.756 33.1275 156.249 37.2734C164.508 39.3496 171.09 42.0915 175.653 45.2715C180.225 48.4579 182.45 51.8427 182.802 55.2004C183.154 58.5581 181.679 62.3308 177.868 66.396C174.064 70.453 168.192 74.4996 160.544 78.2433C145.269 85.7193 123.511 91.694 98.9101 94.2729C74.3088 96.8518 51.784 95.5192 35.2913 91.3732C27.0327 89.2971 20.4497 86.556 15.887 83.3761C11.3152 80.1897 9.08969 76.8049 8.73769 73.4472C8.38571 70.0895 9.86093 66.3168 13.6726 62.2516C17.4766 58.1945 23.3479 54.147 30.9966 50.4033C46.2709 42.9272 68.0298 36.9535 92.6311 34.3746Z"
            fill="var(--spaceship)" stroke="var(--color-primary)" stroke-width="6" stroke-linejoin="round"/>
          <path d="M88.1337 12.6491C110.649 10.2892 130.82 26.5555 133.319 49.0223C133.284 49.0936 133.226 49.2019 133.13 49.3494C132.805 49.8481 132.217 50.537 131.301 51.3773C129.481 53.0467 126.671 55.0332 123.02 57.0156C115.73 60.9727 105.418 64.7345 93.7222 65.9605C82.0265 67.1866 71.1575 65.6452 63.2057 63.2857C59.2224 62.1037 56.0619 60.7431 53.935 59.4874C52.8645 58.8554 52.1468 58.3034 51.7254 57.8828C51.6005 57.7582 51.5207 57.6646 51.4721 57.6021C49.2573 35.1054 65.6185 15.0094 88.1337 12.6491Z"
            fill="var(--spaceship)" stroke="var(--color-primary)" stroke-width="6" stroke-linejoin="round"/>
          <path d="M36.2609 68.3415C36.5151 70.7666 34.7553 72.9386 32.3302 73.1929C29.9051 73.4471 27.7331 71.6872 27.4789 69.2621C27.2246 66.837 28.9845 64.665 31.4096 64.4108C33.8347 64.1566 36.0067 65.9164 36.2609 68.3415Z"
            fill="var(--color-primary)"/>
          <path d="M125.776 75.2927C126.03 77.7178 124.27 79.8898 121.845 80.144C119.42 80.3982 117.248 78.6384 116.994 76.2133C116.739 73.7882 118.499 71.6162 120.924 71.362C123.349 71.1077 125.521 72.8676 125.776 75.2927Z"
            fill="var(--color-primary)"/>
          <path d="M77.4748 80.3562C77.729 82.7813 75.9692 84.9533 73.5441 85.2075C71.119 85.4617 68.9469 83.7019 68.6927 81.2768C68.4385 78.8517 70.1984 76.6797 72.6235 76.4254C75.0486 76.1712 77.2206 77.9311 77.4748 80.3562Z"
            fill="var(--color-primary)"/>
          <path d="M163.601 54.9929C163.855 57.418 162.095 59.59 159.67 59.8442C157.245 60.0984 155.073 58.3386 154.819 55.9135C154.564 53.4884 156.324 51.3164 158.749 51.0622C161.175 50.8079 163.347 52.5678 163.601 54.9929Z"
            fill="var(--color-primary)"/>
          <mask id="mask0_1719_251" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="42" y="117" width="63" height="63">
          <rect x="73.7324" y="117.661" width="43.9892" height="43.9892" transform="rotate(45.6302 73.7324 117.661)" fill="#07CB7D"/>
          </mask>
          </g>

          <!-- icons -->
          <g class="icon-group">

            <!-- music icon -->
            <g class="icon">
              <path d="M166.332 201.57C170.359 201.57 173.624 204.835 173.624 208.862V220.528C173.624 224.555 170.359 227.82 166.332 227.82H154.665C150.638 227.82 147.374 224.555 147.374 220.528V208.862C147.374 204.835 150.638 201.57 154.665 201.57H166.332ZM157.028 209.025V215.952C156.785 215.804 156.532 215.692 156.269 215.618C156.005 215.544 155.719 215.507 155.408 215.507C154.517 215.507 153.754 215.824 153.119 216.459C152.485 217.094 152.167 217.856 152.167 218.747C152.167 219.638 152.484 220.401 153.119 221.036C153.754 221.671 154.517 221.988 155.408 221.988C156.299 221.988 157.062 221.671 157.696 221.036C158.331 220.401 158.648 219.638 158.648 218.747V212.266L165.13 210.99V214.332C164.887 214.183 164.633 214.072 164.37 213.998C164.107 213.924 163.82 213.887 163.51 213.887C162.619 213.887 161.855 214.203 161.221 214.838C160.586 215.473 160.269 216.236 160.269 217.127C160.269 218.018 160.586 218.781 161.221 219.416C161.855 220.051 162.619 220.368 163.51 220.368C164.401 220.368 165.164 220.051 165.799 219.416C166.433 218.781 166.75 218.018 166.75 217.127V207.404L157.028 209.025Z"
                fill="#FF3F85"/>
            </g>

            <!-- document icon -->
            <g class="icon">
              <mask id="mask1_1721_253" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="110" y="197" width="35" height="36">
              <rect x="110" y="197.195" width="35" height="35" fill="#0A77F3"/>
              </mask>
            <g mask="url(#mask1_1721_253)">
              <path d="M131.204 200.695C133.537 200.695 135.728 201.813 137.1 203.699L139.355 206.799C140.261 208.045 140.75 209.546 140.75 211.087V220.821C140.75 224.848 137.485 228.113 133.458 228.113H121.792C117.765 228.113 114.5 224.848 114.5 220.821V207.987C114.5 203.96 117.765 200.695 121.792 200.695H131.204ZM121.792 203.612C119.376 203.612 117.417 205.571 117.417 207.987V220.821C117.417 223.237 119.376 225.196 121.792 225.196H133.458C135.874 225.196 137.833 223.237 137.833 220.821V213.236H134.333C131.917 213.236 129.958 211.278 129.958 208.861V203.612H121.792ZM132.874 208.861C132.874 209.667 133.528 210.319 134.333 210.319H137.763C137.647 209.671 137.388 209.052 136.996 208.514L134.741 205.413C134.26 204.752 133.61 204.248 132.874 203.943V208.861Z"
                fill="#0A77F3"/>
            </g>
              <mask id="mask2_1721_253" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="79" y="197" width="35" height="36">
              <rect x="79" y="197.195" width="35" height="35" fill="#0A77F3"/>
              </mask>
            </g>

            <!-- pdf icon-->
            <g class="icon" mask="url(#mask2_1721_253)">
            <path d="M100.08 201.569C102.413 201.57 104.604 202.575 105.976 204.272L108.231 207.062C109.137 208.184 109.626 209.535 109.626 210.922V221.257C109.626 224.881 106.361 227.819 102.334 227.819H90.668C86.6409 227.819 83.3761 224.881 83.376 221.257V208.132C83.3761 204.508 86.641 201.569 90.668 201.569H100.08ZM91.7598 217.275C91.3131 217.275 90.9263 217.39 90.5996 217.616C90.4376 217.728 90.2943 217.865 90.1699 218.027V217.336H88.3896V224.676H90.1699V222.038C90.3002 222.205 90.4501 222.348 90.6201 222.466C90.9534 222.686 91.3466 222.796 91.7998 222.796C92.3063 222.796 92.7428 222.683 93.1094 222.456C93.4826 222.229 93.7697 221.909 93.9697 221.496C94.1764 221.083 94.2793 220.605 94.2793 220.065C94.2793 219.499 94.1732 219.009 93.96 218.596C93.7534 218.176 93.4599 217.853 93.0801 217.626C92.7068 217.393 92.2664 217.275 91.7598 217.275ZM98.874 218.041C98.7414 217.868 98.5885 217.723 98.4141 217.605C98.0875 217.379 97.6942 217.266 97.2344 217.266C96.7411 217.266 96.3038 217.382 95.9238 217.615C95.5505 217.842 95.2604 218.159 95.0537 218.565C94.8537 218.972 94.7539 219.453 94.7539 220.006C94.7539 220.566 94.8569 221.056 95.0635 221.476C95.2701 221.896 95.5643 222.222 95.9443 222.455C96.3242 222.688 96.767 222.806 97.2734 222.806C97.7266 222.806 98.1137 222.692 98.4336 222.466C98.6007 222.35 98.747 222.208 98.874 222.041V222.735H100.654V215.315H98.874V218.041ZM104.46 215.236C104.067 215.236 103.713 215.309 103.399 215.456C103.086 215.596 102.836 215.803 102.649 216.076C102.47 216.349 102.38 216.686 102.38 217.086V217.586H101.649V218.746H102.38V222.736H104.149V218.746H105.35V217.586H104.149V217.216C104.149 217.089 104.176 216.983 104.229 216.896C104.283 216.803 104.353 216.736 104.439 216.696C104.533 216.656 104.64 216.636 104.76 216.636C104.853 216.636 104.95 216.649 105.05 216.676C105.156 216.702 105.259 216.736 105.359 216.776L105.59 215.446C105.423 215.38 105.24 215.329 105.04 215.296C104.847 215.256 104.653 215.236 104.46 215.236ZM97.7139 218.686C97.9472 218.686 98.1509 218.742 98.3242 218.855C98.4975 218.969 98.6303 219.129 98.7236 219.336C98.8236 219.543 98.874 219.782 98.874 220.056C98.874 220.329 98.8236 220.569 98.7236 220.775C98.6303 220.975 98.4975 221.136 98.3242 221.256C98.1509 221.369 97.9472 221.426 97.7139 221.426C97.4806 221.426 97.2737 221.369 97.0938 221.256C96.9204 221.136 96.7836 220.975 96.6836 220.775C96.5903 220.569 96.544 220.329 96.5439 220.056C96.5439 219.783 96.5904 219.543 96.6836 219.336C96.7836 219.129 96.9205 218.969 97.0938 218.855C97.2737 218.742 97.4805 218.686 97.7139 218.686ZM91.3193 218.646C91.5527 218.646 91.7564 218.706 91.9297 218.826C92.1096 218.939 92.2465 219.099 92.3398 219.306C92.4398 219.512 92.4892 219.749 92.4893 220.016C92.4893 220.282 92.4398 220.519 92.3398 220.726C92.2465 220.932 92.1097 221.096 91.9297 221.216C91.7564 221.329 91.5527 221.386 91.3193 221.386C91.0995 221.386 90.8996 221.329 90.7197 221.216C90.5464 221.102 90.4096 220.942 90.3096 220.735C90.2163 220.522 90.1699 220.282 90.1699 220.016C90.1699 219.742 90.2163 219.506 90.3096 219.306C90.4095 219.099 90.5465 218.939 90.7197 218.826C90.8996 218.706 91.0995 218.646 91.3193 218.646ZM100.876 209.444C100.876 210.169 101.529 210.757 102.334 210.757H106.702C106.666 209.983 106.38 209.235 105.872 208.606L103.617 205.815C102.953 204.993 101.967 204.442 100.876 204.26V209.444Z" fill="#FF3535"/>
            </g>

            <!-- img icon-->
            <g class="icon" mask="url(#mask3_1721_253)">
            <path d="M38.333 201.569C42.3601 201.569 45.625 204.834 45.625 208.861V220.527C45.625 224.554 42.3601 227.819 38.333 227.819H26.667C22.6399 227.819 19.375 224.554 19.375 220.527V208.861C19.375 204.834 22.6399 201.569 26.667 201.569H38.333ZM36.0107 212.608C35.72 212.202 35.1151 212.202 34.8242 212.608L30.335 218.892L27.9941 215.548C27.7039 215.133 27.0892 215.134 26.7988 215.548L23.0967 220.838C22.7584 221.321 23.1034 221.986 23.6934 221.986H41.293C41.8851 221.985 42.2288 221.314 41.8848 220.832L36.0107 212.608ZM26.4434 206.619C25.3283 206.619 24.4239 207.523 24.4238 208.638C24.4238 209.753 25.3282 210.657 26.4434 210.657C27.5585 210.657 28.4629 209.753 28.4629 208.638C28.4628 207.523 27.5585 206.619 26.4434 206.619Z" fill="#07CB7D"/>
            </g>

            <!-- ZIP icon-->
            <g class="icon">
              <path d="M68.0791 201.57C70.4117 201.57 72.6026 202.576 73.9746 204.273L76.2305 207.063C77.1365 208.185 77.625 209.536 77.625 210.923V221.258C77.6249 224.882 74.36 227.82 70.333 227.82H58.667C54.64 227.82 51.3751 224.882 51.375 221.258L51.375 208.133C51.375 205.024 53.7768 202.422 57.001 201.744V202.654H59.001V201.57H68.0791ZM57.2441 215.654C56.8027 215.654 56.413 215.944 56.2861 216.367L55.334 219.541C55.1205 220.253 55.2008 221.021 55.5566 221.674C56.6117 223.608 59.3892 223.608 60.4443 221.674C60.8002 221.021 60.8805 220.253 60.667 219.541L59.7139 216.367C59.587 215.944 59.1975 215.654 58.7559 215.654H57.2441ZM56.2119 220.048C57.3379 219.485 58.6631 219.485 59.7891 220.048L60 220.153C59.9999 221.258 59.1045 222.153 58 222.153C56.8957 222.153 56.0001 221.258 56 220.153L56.2119 220.048ZM57 212.655V214.655H59V212.655H57ZM68.874 209.445C68.8741 210.17 69.5276 210.758 70.333 210.758H74.7012C74.665 209.984 74.3787 209.236 73.8711 208.607L71.6162 205.816C70.9513 204.994 69.9658 204.443 68.874 204.261V209.445ZM57 210.655H59V208.655H57V210.655ZM57 206.656H59V204.656H57V206.656Z"
                fill="#FFC506"/>
            </g>
          </g>
        </svg>
        <p class="text-[var(--text-terceary)] text-center font-semibold text-xl">
          Your space is waiting for something awesome.
        </p>
        <!-- actions desktop-->

        <div class="flex items-center gap-3">

          <!-- Upload button -->
          <label
            v-if="!hideBar"
            for="fileInputBtn"
            class="
              hidden items-center
              bg-[var(--color-primary)]
              border border-[var(--color-primary)]
              text-white text-sm font-medium
              px-2 py-0.5
              rounded-full

              sm:flex
              hover:shadow-[0_0_3px_3px_rgba(10,119,243,0.5)]
              focus:shadow-[0_0_3px_3px_rgba(10,119,243,0.5)]
              transition-all duration-300 ease-in-out
              cursor-pointer
            "
          >
            <img src="/icon/icon-upload.svg" alt="icon" class="h-4 mr-2" />
            <span>Upload</span>
          </label>

          <!-- New folder-->
          <button
            v-if="!hideBar"
            @click="createFolderModal = true"
            class="
              hidden items-center
              bg-[var(--bg-secondary)]
              border border-[var(--border)]
              text-[var(--text-terceary)] text-sm font-medium
              pl-2 pr-2.5 py-0.5
              grayscale
              rounded-full

              sm:flex
              hover:grayscale-0
              hover:text-[var(--text)]
              hover:bg-[var(--hover-bg)]
              hover:border-[var(--hover-border)]
              hover:shadow-[0_0_3px_3px_rgba(10,119,243,0.5)]
              focus:border-[var(--hover-border)]
              focus:shadow-[0_0_3px_3px_rgba(10,119,243,0.5)]
              focus:grayscale-0
              transition-all duration-300 ease-in-out
              cursor-pointer
            "
          >
            <img src="/icon/icon-new-folder.svg" alt="icon" class="h-5 mr-2" />
            Create a folder
          </button>
        </div>
      </div>
    </div>

    <!-- folders -->
    <div
      v-if="folderResults.data.length"
      class="
        w-full
        py-0 px-2 pt-4

        sm:py-4 sm:px-14
      "
    >
      <div class="flex items-center justify-between mb-4 sm:mb-4">
        <h3 class="
            flex items-center
            font-regular text-left text-sm text-[var(--text-terceary)] truncate
            mb-1 gap-2 mx-2

            sm:text-lg sm:mb-0 sm:font-semibold
          "
        >
          <span>Folders</span>
          <button
            type="button"
            @click="showFolders = !showFolders"
            class="
              text-xs rounded-xl p-1 mt-0.5
              border border-transparent

              hover:border-[var(--color-primary)]
              hover:text-[var(--color-primary)]
              transition-all duration-300"
            :class="showFolders ? 'text-[var(--color-primary)]' : 'grayscale'"
          >
          <img
              :src="showFolders ? '/icon/icon-preview.svg' : '/icon/icon-close-eye.svg'"
              alt="eye icon"
              class="h-5"/>
          </button>
        </h3>
      </div>
      <Transition name="slide">
        <div
          v-show="showFolders"
          class="
            grid grid-cols-2 gap-2
            text-[var(--text)]
            my-4  mx-0

            sm:gap-4 sm:mx-2 sm:my-2
            sm:grid-cols-2
            md:grid-cols-3
            lg:grid-cols-4
            xl:grid-cols-6
            transition-all duration-300
          "
        >
          <div
            v-for="folder, index in folderResults.data"
            :key="folder.id"

            @dragover.prevent
            @dragenter="onDragEnter(folder.id)"
            @dragleave="onDragLeave($event, folder.id)"
            @drop="onDrop(folder)"
            data-selectable

            :draggable="true"
            @dragstart="onDragStart('folder', folder, $event)"
            @drag="onDragMove($event)"
            @dragend="onDragEndCleanup()"
            @click="selectItem($event, 'folder', folder, index)"
            @keydown.enter="selectItem($event, 'folder', folder, index)"
            @dblclick="router.push(`/app/folders/${folder.id}`);"
                        :class="[
              'group flex items-center justify-between w-full rounded-2xl border cursor-pointer',
              'bg-[var(--bg-secondary)] transition-all duration-300',
              isSelectedFolder(folder)
                ? 'border-[var(--color-primary)] bg-[var(--hover-bg)] shadow-[0_0_5px_2px_rgba(10,119,243,0.5)]'
                : draggedFolder === folder.id
                  ? 'border-[var(--color-primary)] bg-[var(--hover-bg)]'
                  : 'border-[var(--border)] hover:bg-[var(--hover-bg)] hover:border-[var(--hover-border)]'
            ]"
            >
              <div
                :to="`/app/folders/${folder.id}`"
                class="flex-1 min-w-0"
              >
                <div class="flex items center justify-between p-1">
                  <div
                      class="
                        flex items-center
                        space-x-2
                        min-w-0 w-full overflow-hidden
                      "
                    >
                    <img src="/icon/icon-folder.svg" alt="folder" class="h-8"/>

                    <!-- title and date -->
                    <div class="flex-1 min-w-0">
                      <div>
                        <input
                          v-if="editingFolderId === folder.id"
                          v-model="editedFolderName"
                          @keyup.enter="saveFolderName(folder)"
                          :data-folder-id="folder.id"
                          @blur="editingFolderId = null"
                          class="
                            bg-transparent
                            border-b border-[var(--color-primary)]
                            outline-none text-xs sm:text-sm w-full"
                        />

                        <h3
                          v-else
                          class="font-semibold text-xs sm:text-sm truncate text-left"
                        >
                          {{ folder.name }}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="
                  flex items-center justify-center
                  border-l border-[var(--border)]
                  w-6 py-2

                  group-hover:border-[var(--color-primary)]
                  transition-colors duration-300
                "
              >
                  <Dropdown
                    :classes="[
                      'bg-[var(--bg-secondary)]',
                      'border border-[var(--border)]',
                      'rounded-2xl','shadow-md',
                      'absolute','-right-0', 'z-20',
                      dropdownPosition,
                      'w-48',
                      'sm:-right-2'
                    ]"
                  >
                    <template #trigger="{ toggle, close }">
                      <button
                        @click="toggleDropdown(toggle, close, $event)"
                        class="
                          text-[var(--text-terceary)]
                          w-6 h-auto

                          hover:text-[var(--text)]
                          transition-colors duration-300
                        "
                      >
                        <i class="fas fa-ellipsis-v"></i>
                      </button>
                    </template>

                    <template #content="{ close }">
                      <div class="flex flex-col font-regular text-sm text-[#868686]">

                        <div class="border-b border-[var(--border)] p-1 space-y-1">
                        <!--rename folder-->
                          <button
                            type="button"
                            @click="() => { startEditingFolder(folder); close(); }"
                            class="flex items-center justify-start w-full
                              rounded-xl px-3 py-1 border border-transparent

                              hover:bg-[var(--hover-bg)]
                              hover:border-[var(--color-primary)]
                              transition-colors duration-300"
                          >
                            <img src="/icon/icon-edit.svg" alt="edit" class="h-5 mr-4 grayscale"/>
                            <span>Rename</span>
                          </button>
                          <!--move to folder-->
                          <button
                            type="button"
                            @click="selectItem($event, 'folder', folder, index); moveToFolderModal = true;"
                            class="
                              flex items-center justify-start w-full
                              rounded-xl px-3 py-1 border border-transparent

                              hover:bg-[var(--hover-bg)]
                              hover:border-[var(--color-primary)]
                              transition-colors duration-300
                            "
                          >
                            <img src="/icon/icon_move.svg" alt="move" class="h-5 mr-4 grayscale"/>
                            <span>Move to folder</span>
                          </button>
                        </div>
                        <div class="p-1">
                          <!-- delete folder -->
                          <button
                            @click="selectItem($event, 'folder', folder, index); moveToTrash();"
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
                                <mask id="mask0_1676_2" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                                <rect width="24" height="24" fill="#FFC506"/>
                                </mask>
                                <g mask="url(#mask0_1676_2)">
                                <path d="M12 2C14.4189 2 16.4361 3.71782 16.8994 6H22V8H20V17C20 19.7614 17.7614 22 15 22H9C6.23858 22 4 19.7614 4 17V8H2V6H7.10059C7.5639
                                  3.71782 9.58108 2 12 2ZM6 17C6 18.6569 7.34315 20 9 20H15C16.6569 20 18 18.6569 18 17V8H6V17ZM11 18H9V10H11V18ZM15 18H13V10H15V18ZM12
                                  4C10.6941 4 9.58594 4.83532 9.17383 6H14.8262C14.4141 4.83532 13.3059 4 12 4Z" fill="var(--delete-color)"/>
                                </g>
                              </svg>
                            <span>Send to the Void</span>
                          </button>
                        </div>
                      </div>
                    </template>
                  </Dropdown>
              </div>
          </div>
        </div>
      </Transition>
    </div>

    <!-- files -->
    <div
      v-if="fileResults.data.length"
      class="
        border-t border-[var(--border)]
        w-full
        py-6 px-2 pt-4

        sm:mt-0 sm:py-4 sm:px-14
      "
    >
      <div class="flex items-center justify-between mb-4 sm:mb-4">
        <h3
          class="
            flex items-center
            font-regular text-left text-sm text-[var(--text-terceary)] truncate
            mb-1 gap-2 mx-2

            sm:text-lg sm:mb-0 sm:font-semibold
          "
        >
          <span>Your Files</span>
          <button
            type="button"
            @click="showFiles = !showFiles"
            class="
              text-xs rounded-xl
              border border-transparent
              p-1 mt-0.5

              hover:text-[var(--color-primary)]
              hover:border-[var(--color-primary)]
              transition-all duration-300"
            :class="showFiles ? 'text-[var(--color-primary)]' : 'grayscale'"
          >
            <img
              :src="showFiles ? '/icon/icon-preview.svg' : '/icon/icon-close-eye.svg'"
              alt="eye icon"
              class="h-5"/>
          </button>
        </h3>
        <!-- order by -->
        <button
          v-show="showFiles"
          @click="sortOrder = sortOrder === 'desc' ? 'asc' : 'desc'; getFiles()"
          class="
            flex items-center justify-center
            px-2 py-0.5
            text-xs text-[var(--text-terceary)]
            rounded-full border border-[var(--border)]
            hover:bg-[var(--hover-bg)]
            hover:border-[var(--color-primary)]
            transition-all duration-300
          "
        >Order:
          {{ sortOrder === 'desc' ? 'Newest' : 'Oldest' }}
        </button>
      </div>
      <Transition name="slide">
        <div
          v-show="showFiles"
          class="
            grid grid-cols-1 gap-2
            text-[var(--text)]
            my-4  mx-0

            sm:gap-4 sm:mx-2 sm:my-2
            sm:grid-cols-2
            md:grid-cols-3
            lg:grid-cols-4
            xl:grid-cols-5
            2xl:grid-cols-7
            3xl:grid-cols-9
          "
        >
          <div
            v-for="file, index in fileResults.data"
            :key="file.id"
            data-selectable

            :draggable="true"
            @dragstart="onDragStart('file', file, $event)"
            @drag="onDragMove($event)"
            @dragend="onDragEndCleanup()"
            @click="selectItem($event, 'file', file, index)"
            @keydown.enter="selectItem($event, 'file', file, index)"
            @dblclick="previewFile = file"

            class="
              group
              flex items-center justify-between
              w-full
              bg-[var(--bg-secondary)]
              border border-[var(--border)]
              rounded-2xl min-w-0
              cursor-move

              hover:bg-[var(--hover-bg)]
              hover:border-[var(--hover-border)]
              transition-colors duration-300
            "
            :class="[
              'group flex items-center justify-between w-full rounded-2xl border cursor-pointer',
              isSelectedFile(file) ?
                'border-[var(--color-primary)] bg-[var(--hover-bg)] shadow-[0_0_5px_2px_rgba(10,119,243,0.3)]' :
                'border-[var(--border)]'
            ]"
          >
            <div class="flex w-full h-auto items-center justify-between relative">
              <div class="flex-1 min-w-0">
                <div class="flex items center justify-between p-1">
                  <div
                    class="
                      flex items-center
                      space-x-2
                      min-w-0 w-full overflow-hidden
                    "
                  >
                    <!-- icons -->
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
                    <!-- title and date -->
                    <div class="flex-1 min-w-0">
                      <div>
                        <input
                          v-if="editingFileId === file.id"
                          v-model="editedFileName"
                          :data-file-id="file.id"
                          @keyup.enter="saveFileName(file)"
                          @blur="editingFileId = null"
                          class="
                            bg-transparent
                            border-b border-[var(--color-primary)]
                            outline-none text-xs sm:text-sm w-full"
                        />

                        <h3
                          v-else
                          class="font-semibold text-[var(--text)] text-xs sm:text-sm truncate text-left"
                        >
                          {{ file.name }}
                        </h3>
                      </div>
                      <p class="text-[0.7rem] text-[var(--text-terceary)] font-light">
                        <span class="hidden md:inline lg:hidden">{{ moment(file.created * 1000).format('DD/MM/YY') }}</span>
                        <span class="md:hidden lg:inline">{{ moment(file.created * 1000).format('DD/MM/YY HH:mm') }}</span>
                        {{ formatFileSize(file.size) }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <!-- options -->
              <div
                class="
                  flex items-center justify-center
                  border-l border-[var(--border)]
                  w-6 h-full py-1

                  group-hover:border-[var(--color-primary)]
                  transition-colors duration-300
                "
              >
                <Dropdown
                  :classes="[
                    'bg-[var(--bg-secondary)]',
                    'border border-[var(--border)]',
                    'rounded-2xl','shadow-md',
                    'absolute','-right-0', 'z-20',
                    dropdownPosition,
                    'w-48',
                    'sm:-right-2'
                  ]"
                >
                  <template #trigger="{ toggle, close }">
                    <button
                      @click="toggleDropdown(toggle, close, $event)"
                      class="
                        text-[var(--text-terceary)]
                        w-6 h-10

                        hover:text-[var(--text)]
                        transition-colors duration-300
                      "
                    >
                      <i class="fas fa-ellipsis-v"></i>
                    </button>
                  </template>

                  <template #content="{ close }">
                    <div class="flex flex-col font-regular text-sm text-[#868686]">
                      <!--actions info-->
                      <div class="border-b border-[var(--border)] p-1 space-y-1">
                        <!-- info file -->
                        <router-link
                          :to="`/app/files/details/${file.id}`"
                          class="
                            flex items-center justify-start
                            rounded-xl px-3 py-1 border border-transparent

                            hover:bg-[var(--hover-bg)]
                            hover:border-[var(--color-primary)]
                            transition-colors duration-300
                          "
                        >
                          <img src="/icon/icon_details.svg" alt="download" class="h-5 mr-4 grayscale"
                          />
                          <span>info</span>
                        </router-link>
                        <!-- rename -->
                        <button
                          type="button"
                          @click="() => { startEditingFile(file), close(); }"
                          class="
                            flex items-center justify-start w-full
                            rounded-xl px-3 py-1 border border-transparent

                            hover:bg-[var(--hover-bg)]
                            hover:border-[var(--color-primary)]
                            transition-colors duration-300"
                        >
                          <img src="/icon/icon-edit.svg" alt="edit" class="h-5 mr-4 grayscale"/>
                          <span>Rename</span>
                        </button>
                      </div>

                      <!--actions file-->
                      <div class="border-b border-[var(--border)] p-1 space-y-1">
                        <!-- preview file -->
                        <button
                          @click="previewFile = file"
                          class="
                            flex items-center justify-start w-full
                            rounded-xl px-3 py-1 border border-transparent

                            hover:bg-[var(--hover-bg)]
                            hover:border-[var(--color-primary)]
                            transition-colors duration-300
                          "
                        >
                          <img src="/icon/icon-preview.svg" alt="preview" class="h-5 mr-4 grayscale"/>
                          <span>Preview</span>
                        </button>
                        <!-- download -->
                        <button
                          @click="downloadFile(file)"
                          class="
                            flex items-center justify-start w-full
                            rounded-xl px-3 py-1 border border-transparent
                            grayscale

                            hover:bg-[var(--hover-bg)]
                            hover:text-[var(--color-primary)]
                            hover:border-[var(--color-primary)]
                            hover:grayscale-0
                            transition-colors duration-300
                          "
                        >
                          <img src="/icon/icon_download_2.svg" alt="download" class="h-5 mr-4"
                          />
                          <span>Download</span>
                        </button>
                      </div>

                      <!--actions move-->
                      <div class="border-b border-[var(--border)] p-1 space-y-1">
                        <!--move to folder-->
                        <button
                          type="button"
                          @click="selectItem($event, 'file', file, index); moveToFolderModal = true;"
                          class="
                            flex items-center justify-start w-full
                            rounded-xl px-3 py-1 border border-transparent

                            hover:bg-[var(--hover-bg)]
                            hover:border-[var(--color-primary)]
                            transition-colors duration-300
                          "
                        >
                          <img src="/icon/icon_move.svg" alt="move" class="h-5 mr-4 grayscale"/>
                          <span>Move to folder</span>
                        </button>

                        <!--share link-->
                        <button
                          @click="copyLink(file)"
                          class="
                            flex items-center justify-start w-full
                            rounded-xl px-3 py-1 border border-transparent

                            hover:bg-[var(--hover-bg)]
                            hover:border-[var(--color-primary)]
                            transition-all duration-300
                          "
                        >
                          <img src="/icon/icon-link.svg" alt="link" class="h-5 mr-4 -rotate-45 grayscale"/>
                          {{ copied ? 'Copied!' : 'Copy link' }}
                        </button>
                      </div>

                      <!--actions dangerous-->
                      <div class="p-1">
                        <!-- move to trash -->
                        <button
                          @click="selectItem($event, 'file', file, index); moveToTrash();"
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
                            <mask id="mask0_1676_2" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                            <rect width="24" height="24" fill="#FFC506"/>
                            </mask>
                            <g mask="url(#mask0_1676_2)">
                            <path d="M12 2C14.4189 2 16.4361 3.71782 16.8994 6H22V8H20V17C20 19.7614 17.7614 22 15 22H9C6.23858 22 4 19.7614 4 17V8H2V6H7.10059C7.5639
                              3.71782 9.58108 2 12 2ZM6 17C6 18.6569 7.34315 20 9 20H15C16.6569 20 18 18.6569 18 17V8H6V17ZM11 18H9V10H11V18ZM15 18H13V10H15V18ZM12
                              4C10.6941 4 9.58594 4.83532 9.17383 6H14.8262C14.4141 4.83532 13.3059 4 12 4Z" fill="var(--delete-color)"/>
                            </g>
                          </svg>
                          <span>Send to the Void</span>
                        </button>
                      </div>
                    </div>
                  </template>
                </Dropdown>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>

    <Modal v-model="moveToFolderModal" size="xl">
      <template #header>
        <h3 class="">Move:
          <p class="font-normal text-sm mt-2" v-for="file in selectedFiles" :key="file.id">
            {{ file.name }}
          </p>
          <p class="font-normal text-sm mt-2" v-for="folder in selectedFolders" :key="folder.id">
            {{ folder.name }}
          </p>
        </h3>
      </template>

      <template #content>
        <form @submit.prevent="moveToFolder" id="move-to-folder-form" class="my-2">
          <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
            <button
              v-for="folder in folderResults.data"
              :key="folder.id"
              v-show="!selectedFolders.map((f: FolderI) => f.id == folder.id).includes(true)"
              type="button"
              @click="selectedFolder = folder.id"
              class="
                flex items-center justify-start
                px-2 py-0.5 gap-1.5
                rounded-xl
                border
                text-[var(--text-terceary)]
                hover:bg-[var(--hover-bg)]
                hover:border-[var(--color-primary)]
                hover:text-[var(--text)]
                transition
              "
              :class="selectedFolder === folder.id ? 'bg-[var(--hover-bg)] border-[var(--color-primary)] shadow-[0_0_3px_3px_rgba(10,119,243,0.3)]' : 'border-transparent'"
            >
              <img src="/icon/icon-folder.svg" alt="folder" class="h-6"/>
              <span class="text-sm text-left truncate w-full">
                {{ folder.name }}
              </span>
            </button>
          </div>
        </form>
      </template>

      <template #footer>
        <div class="flex w-full items-center justify-between mt-2">
          <!-- create a folder-->
          <button
            v-if="!hideBar"
            @click="createFolderModal = true"
            class="
              flex items-center
              bg-[var(--bg-secondary)]
              border border-[var(--border)]
              text-[var(--text-terceary)] text-sm font-medium
              pl-2 pr-2.5 py-0.5
              grayscale
              rounded-full

              hover:grayscale-0
              hover:text-[var(--text)]
              hover:bg-[var(--hover-bg)]
              hover:border-[var(--hover-border)]
              hover:shadow-[0_0_3px_3px_rgba(10,119,243,0.5)]

              focus:border-[var(--hover-border)]
              focus:shadow-[0_0_3px_3px_rgba(10,119,243,0.5)]
              focus:grayscale-0
              transition-all duration-300 ease-in-out
              cursor-pointer
            "
          >
            <img src="/icon/icon-new-folder.svg" alt="icon" class="h-5 mr-2" />
            New folder
          </button>
          <div class=" flex gap-2">
            <!-- cancel button -->
            <button
              type="button"
              @click="moveToFolderModal = false; selectedFolder = null;"
              class="
                text-[var(--text-secondary)] text-sm font-medium
                border border-[var(--border)] bg-[var(--bg-secondary)]
                rounded-full
                px-3 py-0.5

                hover:border-[var(--text)]
                hover:bg-[var(--bg)]
                hover:text-[var(--text)]
              ">
              Cancel
            </button>

            <!-- move button -->
            <button
              type="submit"
              form="move-to-folder-form"
              class="
                text-sm font-medium
                border
                rounded-full
                px-3.5 py-0.5
                transition
              "
              :class="selectedFolder === null
                ? 'opacity-40 text-[var(--text)] cursor-not-allowed bg-[var(--bg)] border-[var(--border)]'
                : 'hover:shadow-[0_0_3px_3px_rgba(10,119,243,0.5)] text-white bg-[var(--color-primary)] border-[var(--color-primary)]'
              "
            >
              Move
            </button>
          </div>
        </div>
      </template>
    </Modal>

    <Modal v-model="createFolderModal" size="xs">
      <template #header>
        <h3 class="">
        New folder
        </h3>
      </template>
      <template #content>
        <div class="my-4">
          <form @submit.prevent="createFolder" id="create-folder-form">
            <label for="folder-name"></label>
            <img
              src="/icon/icon-folder.svg"
              alt="icon"
              class="h-5 mt-[1px] absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none"
            />
            <input
              v-model="folderName"
              type="text"
              placeholder="Folder name"
              id="folder-name"
              class="
                w-full border
                border-[var(--border)] bg-[var(--bg)]
                text-sm text-[var(--text)]
                my-2 pl-8 py-1
                rounded-full

                placeholder:text-[var(--text-terceary)]
                placeholder:font-light
                placeholder:text-sm

                hover:border-[var(--color-primary)]
                hover:shadow-[0_0_3px_3px_rgba(10,119,243,0.5)]

                focus:border-[var(--color-primary)]
                focus:shadow-[0_0_3px_3px_rgba(10,119,243,0.5)]
                focus:outline-none
                transition-all duration-300 ease-in-out
              "
              name="folder-name"
            />
          </form>
        </div>
      </template>
      <template #footer>
        <button
          type="button"
          @click="createFolderModal = false"
          class="
            text-[var(--text-secondary)] text-sm font-medium
            border border-[var(--border)] bg-[var(--bg)]
            rounded-full
            px-3 py-0.5

            hover:border-[var(--text)]
            hover:bg-[var(--hover-bg-gray)]
            hover:text-[var(--text)]
          "
        >
          Cancel
        </button>
        <button
          type="submit"
          form="create-folder-form"
          :disabled="!folderName || !folderName.trim()"
          class="
            text-[var(--text)] text-sm font-medium
            border
            rounded-full
            px-3 py-0.5
            transition
          "
          :class="!folderName || !folderName.trim()
            ? 'opacity-40 cursor-not-allowed bg-[var(--bg)] border-[var(--border)]'
            : 'hover:shadow-[0_0_3px_2px_rgba(10,119,243,0.5)] bg-[var(--color-primary)] border-[var(--color-primary)]'"
        >
          Create
        </button>
      </template>
    </Modal>

    <Modal v-model="createShareModal" size="md">
      <template #header>
        <h3 class=""> Copy link:
          <p class="font-normal text-sm mt-2" v-for="file in selectedFiles" :key="file.id">
                {{ file.name }}
          </p>
          <p class="font-light text-sm mt-2" v-for="folder in selectedFolders" :key="folder.id">
                "{{ folder.name }}"
          </p>
        </h3>
      </template>
      <template #content>
        <div class="flex flex-col gap-3">
          <div
            class="
              flex
              group
              p-0.5
              bg-[var(--bg)]
              border border-[var(--color-primary)]
              rounded-xl

              hover:bg-[var(--bg-hover)]
              shadow-[0_0_3px_3px_rgba(10,119,243,0.5)]
              transition-all duration-300 ease-in-out
            "
          >
            <input
              :value="shareUrl"
              readonly
              class="
                w-full flex-1
                text-xs text-[var(--text)]
                pr-1 pl-2 py-1
                bg-transparent
                rounded-full
                select-all
                focus:outline-none
              "
              @focus="e => (e.target as HTMLInputElement).select()"
            />
            <button
              type="button"
              @click.stop="tryCopy"
              class="
                flex items-center
                px-2 gap-1
                text-[var(--text)] text-sm font-medium
                bg-[var(--bg-secondary)]
                border border-[var(--color-primary)]

                hover:bg-[var(--color-primary)]
                hover:text-white
                hover:border-[var(--color-primary)]
                hover:shadow-[0_0_3px_2px_rgba(10,119,243,0.5)]
                rounded-lg
                transition-all duration-300 ease-in-out
              "
              :class="copied ? 'bg-[var(--color-primary)] text-white shadow-[0_0_3px_2px_rgba(10,119,243,0.5)]' : ''
              "
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 -rotate-45">
                <mask id="mask0_1677_12" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                <rect width="24" height="24"/>
                </mask>
                <g mask="url(#mask0_1677_12)">
                <path d="M11 17H7C5.61667 17 4.4375 16.5125 3.4625 15.5375C2.4875 14.5625 2 13.3833 2 12C2 10.6167
                  2.4875 9.4375 3.4625 8.4625C4.4375 7.4875 5.61667 7 7 7H11V9H7C6.16667 9 5.45833 9.29167
                  4.875 9.875C4.29167 10.4583 4 11.1667 4 12C4 12.8333 4.29167 13.5417 4.875 14.125C5.45833
                  14.7083 6.16667 15 7 15H11V17ZM8 13V11H16V13H8ZM13 17V15H17C17.8333 15 18.5417
                  14.7083 19.125 14.125C19.7083 13.5417 20 12.8333 20 12C20 11.1667 19.7083 10.4583
                  19.125 9.875C18.5417 9.29167 17.8333 9 17 9H13V7H17C18.3833 7 19.5625 7.4875 20.5375
                  8.4625C21.5125 9.4375 22 10.6167 22 12C22 13.3833 21.5125 14.5625 20.5375 15.5375C19.5625
                  16.5125 18.3833 17 17 17H13Z"/>
                </g>
              </svg>
              {{ copied ? 'Copied!' : 'Copy link' }}
            </button>
          </div>
          <p class="
            flex items-center
            font-light text-xs text-center text-[var(--text-terceary)]
            py-2 mx-2 gap-2

            sm:text-sm
            "
          >
            <img src="/icon/icon-warning.svg" alt="warning" class="h-4 sm:h-5"/>
            Anyone with the link will be able to download the file.
          </p>
        </div>
      </template>
    </Modal>

    <Teleport to="body">
      <div
        v-if="ghostVisible"
        class="fixed pointer-events-none z-[9999] translate-x-3 translate-y-3"
        :style="{ top: ghostY + 'px', left: ghostX + 'px' }"
      >
        <div
          class="
            flex items-center
            gap-1 px-2.5 py-1
            bg-[var(--hover-bg)]
            border border-[var(--color-primary)]
            rounded-full
            text-sm font-medium text-[var(--text)]
            shadow-[0_0_4px_3px_rgba(10,119,243,0.5)] whitespace-nowrap
          "
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4">
              <mask id="mask0_1361_8" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
              <rect width="24" height="24" fill="#0A77F3"/>
              </mask>
              <g mask="url(#mask0_1361_8)">
              <path d="M14.4541 2C16.0537 2.00007 17.5562 2.76591 18.4971 4.05957L20.0439 6.18555C20.6653 7.04006 21 8.06945 21 9.12598V17C21 19.7614 18.7614 22 16 22H8C5.23858 22 3 19.7614 3 17V7C3 4.23858 5.23858 2 8 2H14.4541ZM8 4C6.34315 4 5 5.34315 5 7V17C5 18.6569 6.34315 20 8 20H16C17.6569 20 19 18.6569 19 17V11H16C14.3431 11 13 9.65685 13 8V4H8ZM15 8C15 8.55228 15.4477 9 16 9H18.9951C18.9703 8.41045 18.7739 7.84004 18.4258 7.36133L16.8799 5.23535C16.4241 4.60872 15.7485 4.18846 15 4.0498V8Z" fill="#0A77F3"/>
              </g>
          </svg>
          Moving {{ totalSelected }} {{ totalSelected === 1 ? 'element' : 'elements' }}
        </div>
      </div>
    </Teleport>

    <!-- preview modal -->
    <Teleport to="body">
      <div
        v-if="previewFile"
        class="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex flex-col"
        @click.self="previewFile = null"
        @keydown.esc="previewFile = null"
        @mousemove="onPreviewMouseMove"
        tabindex="0"
      >
        <!-- header -->
        <div
          class="flex items-center justify-between px-6 pt-6 pb-2 transition-all duration-300"
          :class="showPreviewHeader ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'"
        >
          <!-- icons + title-->
          <div class="flex items-center gap-2 min-w-0 flex-1 max-w-[30%]">
            <img v-if="previewFile.contentType === 'application/pdf'" src="/icon/icon-pdf.svg" alt="pdf" class="h-8 w-8" />
            <img v-else-if="previewFile.contentType === 'application/msword' || previewFile.contentType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'" src="/icon/icon-doc.svg" alt="doc" class="h-8 w-8" />
            <img v-else-if="previewFile.contentType === 'application/vnd.ms-excel' || previewFile.contentType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'" src="/icon/icon-excel.svg" alt="excel" class="h-8 w-8" />
            <img v-else-if="previewFile.contentType === 'application/vnd.ms-powerpoint' || previewFile.contentType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'" src="/icon/icon-ppt.svg" alt="ppt" class="h-8 w-8" />
            <img v-else-if="/image\/(png|webp|gif|avif)/.test(previewFile.contentType)" src="/icon/icon-png.svg" alt="png" class="h-8 w-8" />
            <img v-else-if="previewFile.contentType === 'image/svg+xml'" src="/icon/icon-svg.svg" alt="svg" class="h-8 w-8" />
            <img v-else-if="/image\/(jpeg|jpg|bmp|tiff|heic|heif|x-icon|vnd\.microsoft\.icon)/.test(previewFile.contentType)" src="/icon/icon-img.svg" alt="img" class="h-8 w-8" />
            <img v-else-if="/^video\//.test(previewFile.contentType)" src="/icon/icon-video.svg" alt="video" class="h-8 w-8" />
            <img v-else-if="/^audio\//.test(previewFile.contentType)" src="/icon/icon-audio.svg" alt="audio" class="h-8 w-8" />
            <img v-else-if="
                previewFile.name?.toLowerCase().endsWith('.zip') ||
                previewFile.name?.toLowerCase().endsWith('.rar') ||
                previewFile.name?.toLowerCase().endsWith('.7z') ||
                previewFile.name?.toLowerCase().endsWith('.tar') ||
                previewFile.name?.toLowerCase().endsWith('.gz') ||
                previewFile.name?.toLowerCase().endsWith('.bz2')
              "
              src="/icon/icon-compress.svg"
              alt="compressed file icon"
              class="h-8 w-8"
            />
            <img v-else src="/icon/icon-file.svg" alt="file" class="h-8 w-8" />

            <span class="text-white text-lg truncate font-medium">{{ previewFile.name }}</span>
          </diV>

          <!-- navigation -->
          <div class="flex-2 items center space-x-6 mx-4">
            <!-- flecha izquierda -->
            <button
              @click="previewPrev"
              :disabled="currentPreviewIndex === 0"
              class="
                flex-shrink-0
                text-md border border-transparent rounded-xl
                text-[var(--text-terceary)]
                px-1.5 py-0.5
                hover:text-[var(--color-primary)]
                hover:border-[var(--color-primary)]
                hover:shadow-[0_0_5px_2px_rgba(10,119,243,0.5)]

                transition-all duration-300
                disabled:opacity-20 disabled:cursor-not-allowed
              "
            >
              <i class="fas fa-chevron-left text-sm m-1"></i>
            </button>
            <span class="text-white text-base font-lg mx-2">
                {{ currentPreviewIndex + 1 }} <span class="mx-1 text-[var(--text-terceary)] text-sm">of</span> {{ fileResults.data.length }}
            </span>
              <!-- flecha derecha -->
            <button
              @click="previewNext"
              :disabled="currentPreviewIndex === fileResults.data.length - 1"
              class="
                flex-shrink-0
                text-md border border-transparent rounded-xl
                text-[var(--text-terceary)]
                px-1.5 py-0.5
                hover:text-[var(--color-primary)]
                hover:border-[var(--color-primary)]
                hover:shadow-[0_0_5px_2px_rgba(10,119,243,0.5)]

                transition-all duration-300
                disabled:opacity-20 disabled:cursor-not-allowed
              "
            >
              <i class="fas fa-chevron-right text-sm m-1"></i>
            </button>
          </div>

          <!-- actions-->
          <div class="flex items-centern justify-end gap-4 min-w-0 flex-1 max-w-[30%]">
            <!-- info -->
            <router-link
              :to="`/app/files/details/${previewFile.id}`"
              class="
                inline-flex items-center gap-1
                border border-transparent
                text-[var(--color-primary)] font-medium text-sm
                p-1
                rounded-xl grayscale

                hover:text-[var(--text)]
                hover:border-[var(--color-primary)]
                hover:grayscale-0
                hover:shadow-[0_0_3px_3px_rgba(10,119,243,0.5)]

                focus:shadow-[0_0_3px_3px_rgba(10,119,243,0.5)]
                focus:hover:border-[var(--color-primary)]
                focus:grayscale-0
                transition-all duration-300
              "
            >
              <img src="/icon/icon_details.svg" alt="download" class="h-6"/>
            </router-link>

            <!-- Copy link button -->
            <button
              @click="copyLink(previewFile!)"
              class="
                inline-flex items-center gap-1
                border border-transparent
                text-[var(--color-primary)] font-medium text-sm
                p-1
                rounded-xl grayscale

                hover:text-[var(--text)]
                hover:border-[var(--color-primary)]
                hover:grayscale-0
                hover:shadow-[0_0_3px_3px_rgba(10,119,243,0.5)]

                focus:shadow-[0_0_3px_3px_rgba(10,119,243,0.5)]
                focus:hover:border-[var(--color-primary)]
                focus:grayscale-0
                transition-all duration-300
              "
            >
              <img src="/icon/icon-link.svg" alt="download" class="h-6 -rotate-45"/>
            </button>

            <!--download-->
            <button
              @click="downloadFile(previewFile!)"
              class="
                border border-transparent
                text-[var(--color-primary)] font-medium text-sm
                p-1
                rounded-xl grayscale

                hover:text-[var(--text)]
                hover:border-[var(--color-primary)]
                hover:grayscale-0
                hover:shadow-[0_0_3px_3px_rgba(10,119,243,0.5)]

                focus:shadow-[0_0_3px_3px_rgba(10,119,243,0.5)]
                focus:hover:border-[var(--color-primary)]
                focus:grayscale-0
                transition-all duration-300
              "
            >
              <i v-if="downloading" class="fas fa-spinner fa-spin text-white"></i>
              <img src="/icon/icon_download_2.svg" alt="download" class="h-6"/>
            </button>

            <!--close-->
            <button
              @click="() => { if (isFullscreen) toggleFullscreen(); previewFile = null; }"
              class="
                border border-transparent
                text-[var(--color-primary)] font-medium text-sm
                px-2 py-0.5
                rounded-xl grayscale

                hover:text-[var(--color-primary)]
                hover:border-[var(--color-primary)]
                hover:grayscale-0
                hover:shadow-[0_0_3px_3px_rgba(10,119,243,0.5)]

                focus:shadow-[0_0_3px_3px_rgba(10,119,243,0.5)]
                focus:hover:border-[var(--color-primary)]
                focus:grayscale-0
                transition-all duration-300
              "
            >
            <i class="fa-solid fa-xmark text-lg"></i>
            </button>
          </div>
        </div>

        <!-- content -->
        <div class="flex-1 flex flex-col  items-center overflow-hidden px-4 pb-2">
          <!-- preview -->
          <div class="flex-1 flex items-center justify-center overflow-hidden h-full w-full rounded-2xl bg-white/0">
            <div class="flex-1 flex items-center justify-center overflow-hidden h-full w-full">
              <!-- images -->
              <img
                v-if="currentBlobURL && previewFile.contentType.startsWith('image/')"
                :src="currentBlobURL"
                :alt="previewFile.name"
                :style="{ transform: `scale(${zoomLevel})`, transition: 'transform 0.15s ease', transformOrigin: 'center' }"
                @wheel.prevent="onWheelZoom"
                class="max-w-full max-h-full object-contain"
/>
              <!-- video -->
              <!-- eslint-disable-next-line vuejs-accessibility/media-has-caption -->
              <template v-else-if="currentBlobURL && previewFile.contentType.startsWith('video/')">
                <div class="flex flex-col items-center justify-start w-full h-full rounded-2xl overflow-hidden bg-gradient-to-t from-black to-transparent">
                  <!-- video -->
                  <video
                    :src="currentBlobURL"
                    :title="`Video preview of ${previewFile.name || 'video'}`"
                    class="max-w-full max-h-full flex-1 min-h-0"
                    ref="videoRef"
                    @timeupdate="onTimeUpdate"
                    @loadedmetadata="onLoadedMetadata"
                    @ended="isPlaying = false"
                  >
                    <track kind="captions" />
                  </video>

                  <!-- controles -->
                  <div class="w-full px-2 flex flex-col gap-2 flex-shrink-0">
                    <!-- barra de progreso -->
                    <div
                      @click="seek"
                      @keydown="seek"
                      role="slider"
                      tabindex="0"
                      :aria-valuenow="Math.round(progressPercent)"
                      aria-valuemin="0"
                      aria-valuemax="100"
                      class="relative mx-2 h-1 bg-[var(--text-terceary)] rounded-full cursor-pointer"
                    >
                      <div class="absolute top-0 left-0 h-full rounded-full bg-[var(--color-primary)]" :style="{ width: progressPercent + '%' }" />
                      <div class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[var(--color-primary)]" :style="{ left: progressPercent + '%' }" />
                    </div>

                    <!-- botones -->
                    <div class="flex items-center gap-3 mb-1">
                      <button
                        @click="togglePlay"
                        class="
                          border border-transparent
                          text-[var(--color-primary)] font-medium text-sm
                          p-1 rounded-xl grayscale
                          hover:text-[var(--text)]
                          hover:border-[var(--color-primary)]
                          hover:grayscale-0
                          transition-all duration-300
                        "
                      >
                        <img v-if="isPlaying" src="/icon/icon-pause.svg" alt="Pause" class="h-6 w-6" />
                        <img v-else src="/icon/icon-play.svg" alt="Play" class="h-6 w-6" />
                      </button>
                      <button
                        @click="toggleMute"
                        class="
                          border border-transparent
                          text-[var(--color-primary)] font-medium text-sm
                          p-1 rounded-xl grayscale
                          hover:text-[var(--text)]
                          hover:border-[var(--color-primary)]
                          hover:grayscale-0
                          transition-all duration-300
                        "
                      >
                        <img v-if="isMuted" src="/icon/icon-mute.svg" alt="Unmute" class="h-6" />
                        <img v-else src="/icon/icon-sound.svg" alt="Mute" class="h-6" />
                      </button>
                      <label class="sr-only" for="volume-slider">Volumen</label>
                      <input type="range" min="0" max="1" step="0.01" :value="volume" @input="volume = parseFloat(($event.target as HTMLInputElement).value); onVolumeChange()"
                        class="
                        volume-slider w-24"
                        :style="{
                          background: `linear-gradient(to right, var(--color-primary) ${volume * 100}%, var(--text-terceary) ${volume * 100}%)`
                        }"
                      />

                      <div class="flex-1 flex items-center justify-end w-full">
                      <button
                        @click="toggleFullscreen"
                        class="
                          border border-transparent
                          text-[var(--color-primary)] font-medium text-sm
                          p-1 rounded-xl grayscale
                          hover:text-[var(--text)]
                          hover:border-[var(--color-primary)]
                          hover:grayscale-0
                          transition-all duration-300
                        "
                      >
                        <img
                          :src="isFullscreen
                          ? '/icon/icon-fullscreen-close.svg' : '/icon/icon-fullscreen.svg'"
                          alt="fullscreen"
                          class="w-6 h-6"/>
                      </button>
                    </div>
                    </div>
                  </div>

                </div>
              </template>
              <!-- pdf -->
              <iframe
                v-else-if="currentBlobURL && previewFile.contentType === 'application/pdf'"
                :src="currentBlobURL"
                :title="`PDF preview of ${previewFile.name || 'document'}`"
                class="w-full h-full object-contain"
              />
              <!-- audio -->
              <!-- eslint-disable-next-line vuejs-accessibility/media-has-caption -->
              <audio
                v-else-if="currentBlobURL && previewFile.contentType.startsWith('audio/')"
                :src="currentBlobURL"
                :title="`Audio preview of ${previewFile.name || 'audio'}`"
                class="w-full h-full object-contain"
                controls
              />
              <!-- text -->
              <pre
                v-else-if="currentBlobURL && previewFile.contentType.startsWith('text/')"
                class="w-full h-full object-contain"
              >
                {{ currentBlobURL }}
              </pre>
              <!-- code -->
              <pre
                v-else-if="currentBlobURL && previewFile.contentType.startsWith('application/json')"
                class="w-full h-full object-contain"
              >
                {{ currentBlobURL }}
              </pre>
              <!-- other -->
              <div v-else class="flex items-center gap-2 text-[var(--text-terceary)] text-sm mt-1">
                <img src="/icon/icon-file.svg" alt="file" class="h-30 w-30" />
                <i class="fas fa-eye-slash text-xs"></i>
                <span>No se admite la vista previa para este tipo de archivo.</span>
              </div>
            </div>
          </div>
          <!-- zoom controls -->
          <div v-if="previewFile.contentType?.startsWith('image/')" class="flex items-center justify-center px-1 w-full mx-4">
            <div class="flex-1 w-full h-full"></div>
            <div class="flex-2 space-x-6 ">
            <button
              @click="zoomOut"
              :disabled="zoomLevel <= 0.25"
              class="
                flex-shrink-0
                text-md border border-transparent rounded-xl
                text-[var(--text-terceary)]
                px-1.5 py-0.5
                hover:text-[var(--color-primary)]
                hover:border-[var(--color-primary)]
                hover:shadow-[0_0_5px_2px_rgba(10,119,243,0.5)]

                transition-all duration-300
                disabled:opacity-20 disabled:cursor-not-allowed
              "
            >
              <i class="fas fa-minus text-sm m-1"></i>
            </button>
            <span
              class="text-white text-md truncate font-base text-center cursor-pointer"
              @click="resetZoom"
              @keydown.enter="resetZoom"
              tabindex="0"
            >
              {{ Math.round(zoomLevel * 100) }}%
            </span>
            <button
              @click="zoomIn"
              :disabled="zoomLevel >= 4"
              class="
              flex-shrink-0
              text-md border border-transparent rounded-xl
              text-[var(--text-terceary)]
              px-1.5 py-0.5
              hover:text-[var(--color-primary)]
              hover:border-[var(--color-primary)]
              hover:shadow-[0_0_5px_2px_rgba(10,119,243,0.5)]

              transition-all duration-300
              disabled:opacity-20 disabled:cursor-not-allowed
            "
            >
              <i class="fas fa-plus text-sm m-1"></i>
            </button>
          </div>
          <div class="flex-1 items-center w-full">
            <button
              @click="toggleFullscreen"
              class="
                border border-transparent
                text-[var(--color-primary)] font-medium text-sm
                p-1 rounded-xl grayscale mx-2
                hover:text-[var(--text)]
                hover:border-[var(--color-primary)]
                hover:grayscale-0
                hover:shadow-[0_0_3px_3px_rgba(10,119,243,0.5)]
                transition-all duration-300
              "
            >
              <img
                :src="isFullscreen
                ? '/icon/icon-fullscreen-close.svg' : '/icon/icon-fullscreen.svg'"
                alt="fullscreen"
                class="w-5 h-5"/>
            </button>
          </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import {
  defineAsyncComponent,
  onUnmounted,
  onMounted,
  computed,
  nextTick,
  ref,
  watch,
} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import moment from 'moment';

import { FolderI, FoldersResultI } from '@/store/folders/state';
import { FileI, FilesResultI } from '@/store/files/state';

const Dropdown = defineAsyncComponent(() => import('@/components/global/dropdown.vue'));
const Modal = defineAsyncComponent(() => import('@/components/global/modal.vue'));

const router = useRouter();
const store = useStore();
const route = useRoute();

const dragLeaveTimeout = ref<ReturnType<typeof setTimeout> | null>(null);
const draggedFolder = ref<number | string | null>(null);
const selectedFolder = ref<number | string | null>(null);
const editingFileId = ref<number | string | null>(null);
const draggedItem = ref<FileI | FolderI | null>(null);
const activeDropdown = ref<(() => void) | null>(null);
const lastSelectedIndex = ref<number | null>(null);
const editingFolderId = ref<number | null>(null);
const currentBlobURL = ref<string | null>(null);
const sortOrder = ref<'desc' | 'asc'>('desc');
const previewFile = ref<FileI | null>(null);
const dropdownPosition = ref('top-8');
const createFolderModal = ref(false);
const moveToFolderModal = ref(false);
const createShareModal = ref(false);
const showPreviewHeader = ref(true);
const editedFolderName = ref('');
const editedFileName = ref('');
const showFolders = ref(true);
const showFiles = ref(true);
const folderName = ref('');
const loading = ref(false);
const copied = ref(false);
const shareUrl = ref('');
const ghostVisible = ref(false);
const ghostX = ref(0);
const ghostY = ref(0);
const zoomLevel = ref(1);
const isFullscreen = ref(false);
const videoRef = ref(null);
const isPlaying = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const volume = ref(0.8);
const isMuted = ref(false);
const controlsVisible = ref(true);
const hideTimer: ReturnType<typeof setTimeout> | null = null;

const selectedFolders = computed<FolderI[]>(() => store.state.folders.selectedFolders);
const folderResults = computed<FoldersResultI>(() => store.state.folders.result);
const selectedFiles = computed<FileI[]>(() => store.state.files.selectedFiles);
const fileResults = computed<FilesResultI>(() => store.state.files.result);
const folderId = computed<number>(() => Number(route.params.id as string));
const totalSelected = computed(() => selectedFiles.value.length + selectedFolders.value.length);
const currentPreviewIndex = computed(() => fileResults.value.data.findIndex((f: FileI) => f.id === previewFile.value?.id));

const progressPercent = computed(() => (duration.value ? (currentTime.value / duration.value) * 100 : 0));

const isSelectedFolder = (item: FolderI) => selectedFolders.value.some((f: FolderI) => f.id === item.id);
const isSelectedFile = (item: FileI) => selectedFiles.value.some((f: FileI) => f.id === item.id);

async function getBase64(file: FileI) {
  const base64 = await store.dispatch('files/getCacheFile', {
    id: file.id,
  });

  if (base64) {
    // create blob url
    const blob = await fetch(base64).then((r) => r.blob());
    const url = URL.createObjectURL(blob);
    currentBlobURL.value = url;
    return url;
  }

  await store.dispatch('files/saveCacheFile', file);

  return '';
}

function togglePlay() {
  const v = videoRef.value;
  if (!v) return;
  if (isPlaying.value) { v.pause(); isPlaying.value = false; } else { v.play(); isPlaying.value = true; }
}

function onTimeUpdate() {
  currentTime.value = videoRef.value?.currentTime ?? 0;
}

function onLoadedMetadata() {
  duration.value = videoRef.value?.duration ?? 0;
  videoRef.value.volume = volume.value;
}

function seek(e) {
  const rect = e.currentTarget.getBoundingClientRect();
  const ratio = (e.clientX - rect.left) / rect.width;
  videoRef.value.currentTime = ratio * duration.value;
}

function toggleMute() {
  isMuted.value = !isMuted.value;
  videoRef.value.muted = isMuted.value;
}

function onVolumeChange() {
  if (videoRef.value) videoRef.value.volume = volume.value;
  isMuted.value = volume.value === 0;
}
function zoomIn() {
  zoomLevel.value = Math.min(zoomLevel.value + 0.10, 4);
}

function zoomOut() {
  zoomLevel.value = Math.max(zoomLevel.value - 0.10, 0.10);
}

function resetZoom() {
  zoomLevel.value = 1;
}

function onWheelZoom(e: WheelEvent) {
  if (!previewFile.value?.contentType?.startsWith('image/')) return;
  e.preventDefault();
  if (e.deltaY < 0) zoomIn();
  else zoomOut();
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
    isFullscreen.value = true;
  } else {
    document.exitFullscreen();
    isFullscreen.value = false;
  }
}

let hideHeaderTimeout: ReturnType<typeof setTimeout> | null = null;

function onFullscreenChange() {
  isFullscreen.value = !!document.fullscreenElement;
  if (!isFullscreen.value) {
    showPreviewHeader.value = true;
    if (hideHeaderTimeout) clearTimeout(hideHeaderTimeout);
  }
}

function onPreviewMouseMove(e: MouseEvent) {
  if (!isFullscreen.value) return;

  if (e.clientY < 80) {
    showPreviewHeader.value = true;
    if (hideHeaderTimeout) clearTimeout(hideHeaderTimeout);
  } else {
    if (hideHeaderTimeout) clearTimeout(hideHeaderTimeout);
    hideHeaderTimeout = setTimeout(() => {
      showPreviewHeader.value = false;
    }, 1500);
  }
}

function previewNext() {
  const next = fileResults.value.data[currentPreviewIndex.value + 1];
  if (next) { previewFile.value = next; resetZoom(); }
}

function previewPrev() {
  const prev = fileResults.value.data[currentPreviewIndex.value - 1];
  if (prev) { previewFile.value = prev; resetZoom(); }
}

async function moveToFolder() {
  console.log('selectedFolder', selectedFolder.value);
  if (selectedFolder.value === null) {
    return;
  }

  try {
    loading.value = true;
    console.log('selectedFiles', selectedFiles.value);
    const payloadFiles: FileI[] = selectedFiles.value.map((file: FileI) => ({
      ...file,
      folderId: selectedFolder.value,
    }));
    console.log('payload', payloadFiles);

    if (payloadFiles.length > 0) {
      await store.dispatch('files/moveFilesToFolder', payloadFiles);
      await store.dispatch('files/filter', {
        query: '',
        page: 1,
        orderBy: 'created',
        order: 'desc',
        folderId: '',
      });
    }

    const payloadFolders: FolderI[] = selectedFolders.value.map((folder: FolderI) => ({
      ...folder,
      folderId: selectedFolder.value,
    }));
    console.log('payload', payloadFolders);

    if (payloadFolders.length > 0) {
      await store.dispatch('folders/moveFoldersToFolder', payloadFolders);
      await store.dispatch('folders/filter', {
        query: '',
        page: 1,
        folderId: '',
      });
    }

    moveToFolderModal.value = false;
    selectedFolder.value = null;
  } catch (error: unknown) {
    console.error(error);
    const errorResponse = error as { response?: { data?: { error?: string } } };
    const msg = errorResponse?.response?.data?.error || 'Error al mover los archivos';
    store.commit('notifications/addNotification', {
      type: 'error',
      message: msg,
    });
  } finally {
    loading.value = false;
  }
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / (k ** i)).toFixed(2))} ${sizes[i]}`;
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

const tryCopy = async () => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(shareUrl.value);
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl.value;
      textArea.style.cssText = 'position:fixed;opacity:0;';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
    copied.value = true;
    setTimeout(() => { copied.value = false; }, 2000);
  } catch (error) {
    console.error('Error al copiar:', error);
  }
};

const copyLink = async (file: FileI) => {
  try {
    const url = await store.dispatch('files/getDownloadUrl', file);
    shareUrl.value = url;
    createShareModal.value = true;
    tryCopy();
  } catch (error) {
    console.error('Error:', error);
  }
};

function selectItem(event: KeyboardEvent, type: 'file' | 'folder', item: FileI | FolderI, index: number) {
  if (event.ctrlKey) {
    if (type === 'file') {
      const exists = selectedFiles.value.find((f: FileI) => f.id === item.id);
      if (exists) {
        store.commit('files/setSelectedFiles', selectedFiles.value.filter((f: FileI) => f.id !== item.id));
      } else {
        store.commit('files/setSelectedFiles', [...selectedFiles.value, item as FileI]);
      }
    } else {
      const exists = selectedFolders.value.find((f: FolderI) => f.id === item.id);
      if (exists) {
        store.commit('folders/setSelectedFolders', selectedFolders.value.filter((f: FolderI) => f.id !== item.id));
      } else {
        store.commit('folders/setSelectedFolders', [...selectedFolders.value, item as FolderI]);
      }
    }

    lastSelectedIndex.value = index;
    return;
  }

  // LIMPIAR AMBAS SELECCIONES
  store.commit('files/setSelectedFiles', []);
  store.commit('folders/setSelectedFolders', []);

  if (type === 'file') {
    store.commit('files/setSelectedFiles', [item as FileI]);
  } else {
    store.commit('folders/setSelectedFolders', [item as FolderI]);
  }

  lastSelectedIndex.value = index;
}

function clearSelection() {
  store.commit('files/setSelectedFiles', []);
  store.commit('folders/setSelectedFolders', []);
  lastSelectedIndex.value = null;
}

function handleContainerClick(event: MouseEvent | KeyboardEvent) {
  const target = event.target as HTMLElement;
  if (target.closest('[data-selectable]')) return;
  if (moveToFolderModal.value) return;
  clearSelection();
}

function onDragStart(type: string, item: FileI | FolderI, event: DragEvent) {
  if (type === 'file' && !isSelectedFile(item as FileI)) {
    store.commit('files/setSelectedFiles', [item]);
    store.commit('folders/setSelectedFolders', []);
  } else if (type !== 'file' && !isSelectedFolder(item as FolderI)) {
    store.commit('folders/setSelectedFolders', [item]);
    store.commit('files/setSelectedFiles', []);
  }

  draggedItem.value = item;

  const blank = document.createElement('div');
  blank.style.cssText = 'position:fixed;top:-9999px;opacity:0;';
  document.body.appendChild(blank);
  event.dataTransfer?.setDragImage(blank, 0, 0);
  setTimeout(() => document.body.removeChild(blank), 0);

  ghostVisible.value = true;
  ghostX.value = event.clientX;
  ghostY.value = event.clientY;
}

function onDragMove(event: DragEvent) {
  if (!draggedItem.value || (event.clientX === 0 && event.clientY === 0)) return;
  ghostX.value = event.clientX;
  ghostY.value = event.clientY;
}

function onDragEndCleanup() {
  ghostVisible.value = false;
  draggedItem.value = null;
  draggedFolder.value = null;
}

function onDragOver(event: DragEvent) {
  event.preventDefault();
}

function onDragEnter(targetFolderId: number | string) {
  if (dragLeaveTimeout.value) clearTimeout(dragLeaveTimeout.value);
  draggedFolder.value = targetFolderId;
}

function onDragLeave(event: DragEvent, targetId: number | string) {
  const related = event.relatedTarget as HTMLElement | null;
  const currentTarget = event.currentTarget as HTMLElement;

  if (related && currentTarget.contains(related)) return;

  draggedFolder.value = null;
}

async function getFolders() {
  await store.dispatch('folders/filter', {
    query: '',
    page: 1,
    folderId: '',
  });
}

async function getFiles() {
  await store.dispatch('files/filter', {
    query: '',
    page: 1,
    orderBy: 'created',
    order: sortOrder.value,
    folderId: '',
  });
}

async function moveToTrash() {
  if (selectedFiles.value.length > 0) {
    await store.dispatch('folders/moveFilesToTrash', selectedFiles.value);
  }
  if (selectedFolders.value.length > 0) {
    await store.dispatch('folders/moveFoldersToTrash', selectedFolders.value);
  }

  getFiles();
  getFolders();
}

async function onDrop(folder: FolderI) {
  if (selectedFiles.value.length === 0 && selectedFolders.value.length === 0) return;

  if (!draggedItem.value) return;

  const targetFolderId = folder.id as number;

  const filesPayload: FileI[] = selectedFiles.value.map((file: FileI) => ({
    ...file,
    folderId: targetFolderId,
  }));

  await store.dispatch('files/moveFilesToFolder', filesPayload);

  store.commit('files/setSelectedFiles', []);

  const foldersPayload: FolderI[] = selectedFolders.value
    .filter((f: FolderI) => f.id !== targetFolderId)
    .map((f: FolderI) => ({
      ...f,
      folderId: targetFolderId,
    }));

  await store.dispatch('folders/moveFoldersToFolder', foldersPayload);

  draggedItem.value = null;
  draggedFolder.value = null;
  ghostVisible.value = false; // 👈 único cambio

  getFiles();
  getFolders();
}

async function downloadFile(file: FileI) {
  await store.dispatch('files/downloadFile', file);
}

// create new folder
async function createFolder() {
  // test folder name
  if (!folderName.value) {
    store.commit('notifications/addNotification', {
      message: 'Folder name is required',
      type: 'error',
    });
    return;
  }
  // strip folder name
  const strippedFolderName = folderName.value.trim();
  loading.value = true;
  try {
    console.log('strippedFolderName', strippedFolderName);
    console.log('folderId', folderId.value);
    await store.dispatch('folders/createFolder', {
      name: strippedFolderName,
      folderId: folderId.value,
    });

    createFolderModal.value = false;
    folderName.value = '';

    await getFolders();
  } catch (error: unknown) {
    console.error(error);
    const errorResponse = error as { response?: { data?: { error?: string } } };
    const msg = errorResponse?.response?.data?.error || 'Error al crear la carpeta';
    store.commit('notifications/addNotification', {
      message: msg,
      type: 'error',
    });
  } finally {
    loading.value = false;
  }
}

// rename file
async function startEditingFile(currentFile: FileI) {
  // eslint-disable-next-line no-param-reassign
  editingFileId.value = currentFile.id;

  // Mostrar nombre completo (incluye extensión)
  editedFileName.value = currentFile.name;

  await nextTick();

  const input = document.querySelector(
    `input[data-file-id="${currentFile.id}"]`,
  ) as HTMLInputElement | null;

  if (!input) return;

  input.focus();

  const lastDotIndex = currentFile.name.lastIndexOf('.');

  if (lastDotIndex > 0) {
    // Selecciona solo el nombre, deja visible la extensión
    input.setSelectionRange(0, lastDotIndex);
  } else {
    input.select();
  }
}
// save rename file
async function saveFileName(currentFile: FileI) {
  const finalName = editedFileName.value.trim();
  if (!finalName) return;

  try {
    await store.dispatch('files/changeFileName', {
      id: currentFile.id,
      name: finalName,
    });

    await store.dispatch('files/filter', {
      query: '',
      page: 1,
      orderBy: 'created',
      order: 'desc',
      folderId: '',
    });

    const updatedFile = fileResults.value.data.find(
      (f: FileI) => f.id === currentFile.id,
    );

    if (updatedFile) {
      store.commit('files/setSelectedFiles', [updatedFile]);
    }
  } catch (error) {
    console.error(error);
  } finally {
    editingFileId.value = null;
  }
}

// rename folder
async function startEditingFolder(folder: FolderI) {
  editingFolderId.value = folder.id;
  editedFolderName.value = folder.name;

  await nextTick();

  const input = document.querySelector(
    `input[data-folder-id="${folder.id}"]`,
  ) as HTMLInputElement | null;

  input?.focus();
  input?.select();
}

// save
async function saveFolderName(folder: FolderI) {
  const finalName = editedFolderName.value.trim();
  if (!finalName) return;

  try {
    await store.dispatch('folders/changeFolderName', {
      id: folder.id,
      name: finalName,
    });

    await store.dispatch('folders/filter', {
      query: '',
      page: 1,
      folderId: '',
    });

    await nextTick();

    const updatedFolder = folderResults.value.data.find(
      (f: FolderI) => f.id === folder.id,
    );

    if (updatedFolder) {
      store.commit('folders/setSelectedFolders', [updatedFolder]);
    }
  } catch (error) {
    console.error(error);
  } finally {
    editingFolderId.value = null;
  }
}

function handleKeydown(e: KeyboardEvent) {
  if (previewFile.value) {
    if (e.key === 'Escape') {
      previewFile.value = null;
      e.stopImmediatePropagation();
      return;
    }
    if (e.key === 'ArrowRight') { previewNext(); return; }
    if (e.key === 'ArrowLeft') { previewPrev(); return; }
    if (e.key === 'f' || e.key === 'F') { toggleFullscreen(); return; }
  }

  if (e.key !== 'F2') return;
  if (editingFileId.value || editingFolderId.value) return;

  if (selectedFiles.value.length === 1) {
    startEditingFile(selectedFiles.value[0]);
    return;
  }

  if (selectedFolders.value.length === 1) {
    startEditingFolder(selectedFolders.value[0]);
  }
}

onMounted(() => {
  getFolders();
  getFiles();
  window.addEventListener('keydown', handleKeydown);
  document.addEventListener('fullscreenchange', onFullscreenChange);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
  document.removeEventListener('fullscreenchange', onFullscreenChange);
});

watch(previewFile, async (file: FileI | null) => {
  if (file) {
    getBase64(file);
  }
});

</script>

<style scoped>
.accordion-enter-active,
.accordion-leave-active {
  transition:
    max-height 0.35s ease,
    opacity 0.25s ease;
  overflow: hidden;
}

.accordion-enter-from,
.accordion-leave-to {
  max-height: 0;
  opacity: 1;
}

.accordion-enter-to,
.accordion-leave-from {
  max-height: 1000px; /* suficiente para tu contenido */
  opacity: 1;
}
.slide-enter-active,
.slide-leave-active {
  transition: all 0.35s ease;
  overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-4px);
}

.slide-enter-to,
.slide-leave-from {
  max-height: 500px; /* ajusta según tu contenido */
  opacity: 1;
  transform: translateY(0);
}

.icon {
  transform-box: fill-box;
  transform-origin: center;
  transition: transform 0.6s ease-out;
  will-change: transform;
}
/* SUBIDA */
.group:hover svg .icon:nth-child(1) {
  transform: translate(-10px, -70px) rotate(20deg) scale(1.2);
  transition-duration: 1.6s;
  transition-delay: 0.4s;
  animation: float1 2s ease-in-out infinite alternate;
  animation-delay: 1.9s;
}

.group:hover svg .icon:nth-child(2) {
  transform: translate(-25px, -80px) rotate(25deg) scale(1.2);
  transition-duration: 2.7s;
  transition-delay: 0.4s;
  animation: float2 2.5s ease-in-out infinite alternate;
  animation-delay: 3s;
}

.group:hover svg .icon:nth-child(3) {
  transform: translate(12px, -20px) rotate(-25deg) scale(1.2);
  transition-duration: 1.7s;
  transition-delay: 0.4s;
  animation: float3 1.8s ease-in-out infinite alternate;
  animation-delay: 1.9s;
}

.group:hover svg .icon:nth-child(4) {
  transform: translate(0px, -25px) rotate(18deg) scale(1.2);
  transition-duration: 2.3s;
  transition-delay: 0.4s;
  animation: float4 2s ease-in-out infinite alternate;
  animation-delay: 2.45s;
}

.group:hover svg .icon:nth-child(5) {
  transform: translate(3px, -55px) rotate(-20deg) scale(1.2);
  transition-duration: 1.9s;
  transition-delay: 0.4s;
  animation: float5 2.7s ease-in-out infinite alternate;
  animation-delay: 2.4s;
}

.group:not(:hover) svg .icon {
  animation: none;
  transition: transform 1.5s ease-in;
}

.lights {
  transform-origin: center;
  transform: scaleX(0.1);
  opacity: 0;
  filter: blur(1px);
  transition:
    transform 0.6s cubic-bezier(0.65, 0, 0.35, 1),
    opacity 0.4s ease,
    filter 0.2s ease;
}

/* hover */
.group:hover svg .lights {
  opacity: 1;
  transform: scaleX(1);
  transform: scaleY(1.1);
}

.spacesship {
  transform-box: fill-box;
  transform-origin: center;
  animation: spaceshipFloat 6s ease-in-out infinite;
}

/* FLOTACIÓN  */
@keyframes float {
  0% {transform: translateX(0px) scaleY(1.1);}
  25% {transform: translateX(-5px) scaleY(1.1);}
  50% {transform: translateX(4px) scaleY(1.1);}
  75% {transform: translateX(2px) scaleY(1.1);}
  100% {transform: translateX(0px) scaleY(1.1);}
}
@keyframes float1 {
  0%   { transform: translate(-10px, -70px) rotate(20deg) scale(1.2); }
  100% { transform: translate(-7px, -76px) rotate(23deg) scale(1.2); }
}

@keyframes float2 {
  0%   { transform: translate(-25px, -80px) rotate(25deg) scale(1.2); }
  100% { transform: translate(-20px, -85px) rotate(10deg) scale(1.2); }
}

@keyframes float3 {
  0%   { transform: translate(12px, -20px) rotate(-25deg) scale(1.2); }
  100% { transform: translate(18px, -26px) rotate(-20deg) scale(1.2); }
}

@keyframes float4 {
  0%   { transform: translate(0px, -25px) rotate(18deg) scale(1.2); }
  100% { transform: translate(2px, -18px) rotate(14deg) scale(1.2); }
}

@keyframes float5 {
  0%   { transform: translate(3px, -55px) rotate(-20deg) scale(1.2); }
  100% { transform: translate(9px, -64px) rotate(-28deg) scale(1.2); }
}

@keyframes spaceshipFloat {
  0%   { transform: translate(0px, 0px) rotate(0deg); }
  25%  { transform: translate(16px, 16px) rotate(-8deg); }
  50%  { transform: translate(-6px, 18px) rotate(10deg); }
  75%  { transform: translate(-8px, -8px) rotate(8deg); }
  100% { transform: translate(0px, 0px) rotate(0deg); }
}

input[type='range'].volume-slider {
  -webkit-appearance: none;
  appearance: none;
  height: 4px;
  background: var(--text-terceary);
  border-radius: 9999px;
  outline: none;
}

input[type='range'].volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--color-primary);
  cursor: pointer;
}

input[type='range'].volume-slider::-moz-range-thumb {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--color-primary);
  cursor: pointer;
  border: none;
}
input[type='range'].progress-slider {
  -webkit-appearance: none;
  appearance: none;
  height: 3px;
  background: var(--color-primary);
  border-radius: 9999px;
  outline: none;
}

input[type='range'].progress-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--color-primary);
  cursor: pointer;
}

input[type='range'].progress-slider::-moz-range-thumb {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--color-primary);
  cursor: pointer;
  border: none;
}
</style>
