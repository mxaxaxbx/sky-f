<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex flex-col"
      @click.self="closeModal"
      @keydown.esc="closeModal"
      @mousemove="onPreviewMouseMove"
      @touchstart="onTouchStart"
      @touchend="onTouchEnd"
      tabindex="0"
    >
      <!-- header -->
      <div
        class="transition-all duration-500"
        :class="[
          showPreviewHeader
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-full pointer-events-none',

          isFullscreen
            ? 'fixed top-0 z-50 w-full rounded-t-2xl'
            : 'relative px-3 pb-2 pt-4 sm:px-6 sm:pt-6'
        ]"
      >
        <div
          class="flex flex-col justify-between gap-2 transition-all duration-300 sm:gap-0 sm:flex-row"
          :class=" isFullscreen
            ? 'rounded-t-2xl bg-gradient-to-b from-black/100 via-black/50 to-transparent p-2 h-40 items-start'
            : 'bg-transparent items-center'
          "
        >
          <!-- icons + title-->
          <div class="flex items-center gap-2 min-w-0 flex-1 w-full">
            <img v-if="file.contentType === 'application/pdf'" src="/icon/icon-pdf.svg" alt="pdf" class="h-8 w-8" />
            <img v-else-if="file.contentType === 'application/msword' || file.contentType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'" src="/icon/icon-doc.svg" alt="doc" class="h-8 w-8" />
            <img v-else-if="file.contentType === 'application/vnd.ms-excel' || file.contentType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'" src="/icon/icon-excel.svg" alt="excel" class="h-8 w-8" />
            <img v-else-if="file.contentType === 'application/vnd.ms-powerpoint' || file.contentType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'" src="/icon/icon-ppt.svg" alt="ppt" class="h-8 w-8" />
            <img v-else-if="/image\/(png|webp|gif|avif)/.test(file.contentType)" src="/icon/icon-png.svg" alt="png" class="h-8 w-8" />
            <img v-else-if="file.contentType === 'image/svg+xml'" src="/icon/icon-svg.svg" alt="svg" class="h-8 w-8" />
            <img v-else-if="/image\/(jpeg|jpg|bmp|tiff|heic|heif|x-icon|vnd\.microsoft\.icon)/.test(file.contentType)" src="/icon/icon-img.svg" alt="img" class="h-8 w-8" />
            <img v-else-if="/^video\//.test(file.contentType)" src="/icon/icon-video.svg" alt="video" class="h-8 w-8" />
            <img v-else-if="/^audio\//.test(file.contentType)" src="/icon/icon-audio.svg" alt="audio" class="h-8 w-8" />
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
              class="h-8 w-8"
            />
            <img v-else src="/icon/icon-file.svg" alt="file" class="h-8 w-8" />

            <span class="text-white text-lg truncate font-medium">{{ file.name }}</span>
          </div>

          <!-- navigation -->
          <div class="flex-2 items center space-x-6 mx-4">
            <!-- prev arrow -->
            <button
              @click="previewPrev"
              :disabled="currentPreviewIndex === 0 || disableNavigation"
              class="
                flex-shrink-0
                text-md border border-transparent rounded-xl
                text-[var(--text-terceary)]
                px-1.5 py-0.5
                hover:text-[var(--color-primary)]
                hover:border-[var(--color-primary)]

                transition-all duration-300
                disabled:opacity-20 disabled:cursor-not-allowed
              "
            >
              <i class="fas fa-chevron-left text-sm m-1"></i>
            </button>
            <span class="text-white text-base font-lg mx-2">
                {{ currentPreviewIndex + 1 }} <span class="mx-1 text-[var(--text-terceary)] text-sm">of</span> {{ files.length }}
            </span>
              <!-- next arrow -->
            <button
              @click="previewNext"
              :disabled="currentPreviewIndex === files.length - 1 || disableNavigation"
              class="
                flex-shrink-0
                text-md border border-transparent rounded-xl
                text-[var(--text-terceary)]
                px-1.5 py-0.5
                hover:text-[var(--color-primary)]
                hover:border-[var(--color-primary)]

                transition-all duration-300
                disabled:opacity-20 disabled:cursor-not-allowed
              "
            >
              <i class="fas fa-chevron-right text-sm m-1"></i>
            </button>
          </div>

          <!-- actions-->
          <div class="flex items-center px-6 justify-between gap-4 min-w-0 flex-1 w-full sm:px-0 sm:justify-end">
            <!-- info -->
            <button
              @click="$emit('open-info', file)"
              class="
                border border-transparent
                text-[var(--color-primary)] font-medium text-sm
                p-1
                rounded-xl
                invert brightness-0
                opacity-70

                hover:opacity-100
                hover:invert-0 hover:brightness-100
                hover:text-[var(--text)]
                hover:border-[var(--color-primary)]

                focus:hover:border-[var(--color-primary)]
                focus:grayscale-0
                transition-all duration-300
              "
            >
              <img src="/icon/icon_details.svg" alt="download" class="h-6"/>
            </button>

            <!-- Copy link button -->
            <button
              @click="$emit('copy-link', file)"
              class="
                border border-transparent
                text-[var(--color-primary)] font-medium text-sm
                p-1
                rounded-xl
                invert brightness-0
                opacity-70

                hover:opacity-100
                hover:invert-0 hover:brightness-100
                hover:text-[var(--text)]
                hover:border-[var(--color-primary)]

                focus:hover:border-[var(--color-primary)]
                focus:grayscale-0
                transition-all duration-300
              "
            >
              <img src="/icon/icon-link.svg" alt="download" class="h-6 -rotate-45"/>
            </button>

            <!--download-->
            <button
              @click="$emit('download', file)"
              class="
                border border-transparent
                text-[var(--color-primary)] font-medium text-sm
                p-1
                rounded-xl
                invert brightness-0
                opacity-70

                hover:opacity-100
                hover:invert-0 hover:brightness-100
                hover:text-[var(--text)]
                hover:border-[var(--color-primary)]

                focus:hover:border-[var(--color-primary)]
                focus:grayscale-0
                transition-all duration-300
              "
            >
              <img src="/icon/icon_download_2.svg" alt="download" class="h-6"/>
            </button>

            <!--close-->
            <button
              @click="closeModal"
              class="
                border border-transparent
                text-[var(--color-primary)] font-medium text-sm
                p-0.5
                rounded-xl
                invert brightness-0
                opacity-70

                hover:opacity-100
                hover:invert-0 hover:brightness-100
                hover:text-[var(--text)]
                hover:border-[var(--color-primary)]

                focus:hover:border-[var(--color-primary)]
                focus:grayscale-0
                transition-all duration-300
              "
            >
            <img src="/icon/icon-plus.svg" alt="plus" class="w-7 rotate-45"/>
            </button>
          </div>
        </div>
      </div>

      <!-- content -->
      <div
        class="flex-1 flex flex-col items-center overflow-hidden rounded-2xl"
        :class="isFullscreen
          ? ''
          :'mx-2 mb-2'
        "
      >
        <!-- preview -->
        <div class="flex-1 flex items-center justify-center overflow-hidden h-full w-full rounded-2xl bg-white/5">
          <!-- images -->
          <!-- eslint-disable-next-line vuejs-accessibility/mouse-events-have-key-events -->
          <img
            class="max-w-full max-h-full object-contain cursor-pointer"
            ref="imageRef"
            v-if="currentBlobURL && file.contentType.startsWith('image/')"
            :src="currentBlobURL"
            :alt="file.name"
            :style="{
              transform: `scale(${zoomLevel}) translate(${panOffset.x / zoomLevel}px, ${panOffset.y / zoomLevel}px)`,
              transition: isPanning ? 'none' : 'transform 0.15s ease',
              transformOrigin: 'center',
              cursor: zoomLevel > 1 ? (isPanning ? 'grabbing' : 'grab') : 'default',
            }"

            @wheel.prevent="onWheelZoom"
            @mousedown="onPanStart"
            @mousemove="onPanMove"
            @mouseup="onPanEnd"
            @mouseleave="onPanEnd"
            @blur="onPanEnd"
          />
          <!-- video -->
          <!-- eslint-disable-next-line vuejs-accessibility/media-has-caption -->
          <template v-else-if="currentBlobURL && file.contentType.startsWith('video/')">
            <div
              class="
                relative
                flex flex-col
                items-center justify-center
                w-full h-full
                rounded-2xl
                bg-gradient-to-t from-black to-transparent
              "
            >
              <video
                :src="currentBlobURL"
                :title="`Video preview of ${file.name || 'video'}`"
                class="max-w-full max-h-full object-contain cursor-pointer"
                ref="videoRef"

                @timeupdate="onTimeUpdate"
                @loadedmetadata="onLoadedMetadata"
                @ended="isPlaying = false"
                @click="togglePlay"
                @keydown.space.prevent="togglePlay"
              >
                <track kind="captions" />
              </video>

              <!-- controles -->
              <div
                class="
                  absolute bottom-0 left-0 right-0
                  flex flex-col
                  px-4 pb-2 pt-8 gap-2
                  transtion-all duration-300
                "
                :class="isFullscreen
                  ? (showPreviewHeader ? 'opacity-100'
                  : 'opacity-0 pointer-events-none') : 'opacity-100'
                "
                style="background: linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, transparent 100%)
                "
              >
                <!-- seek -->
                <div
                  @mousedown="onSeekStart"
                  @blur="onSeekEnd"
                  role="slider"
                  tabindex="0"
                  :aria-valuenow="Math.round(progressPercent)"
                  aria-valuemin="0"
                  aria-valuemax="100"
                  class="seek-bar relative mx-2 h-1 bg-[var(--text-terceary)] rounded-full cursor-pointer select-none"
                >
                  <div class="absolute top-0 left-0 h-full rounded-full bg-[var(--color-primary)]" :style="{ width: progressPercent + '%' }" />
                  <div class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[var(--color-primary)]" :style="{ left: progressPercent + '%' }" />
                </div>
                <!-- buttons actions -->
                <div class="flex items-center justify-between">
                  <div class=" flex-1 flex items-center gap-2 mb-1">
                    <!-- play/pause -->
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
                    <!--volumen-->
                    <div
                      class="
                        group
                        relative flex items-center
                        border border-transparent gap-2
                        py-1 px-1.5 rounded-xl grayscale

                        hover:border-[var(--color-primary)]
                        hover:grayscale-0
                        transition-all duration-300
                      "
                    >
                      <!-- Botón volumen -->
                      <button @click="toggleMute">
                        <img v-if="isMuted" src="/icon/icon-mute.svg" alt="Unmute" class="h-6" />
                        <img v-else src="/icon/icon-sound.svg" alt="Mute" class="h-6" />
                      </button>

                      <!-- Slider: oculto por defecto, visible al hacer hover en el grupo -->
                      <div
                        class="
                          flex items-center justify-center
                          w-0 h-5
                          overflow-hidden opacity-0

                          group-hover:w-24 group-hover:opacity-100
                          transition-all duration-300 ease-in-out
                        "
                      >
                        <label class="sr-only" for="volume-slider">Volumen</label>
                        <input
                          id="volume-slider"
                          type="range" min="0" max="1" step="0.01"
                          :value="volume"
                          @input="volume = parseFloat(($event.target as HTMLInputElement).value); onVolumeChange()"
                          class="volume-slider w-24"
                          :style="{
                            background: `linear-gradient(to right, var(--color-primary)
                            ${volume * 100}%, var(--text-terceary) ${volume * 100}%)`
                          }"
                        />
                      </div>
                    </div>
                  </div>
                  <!-- timer -->
                  <div class="flex flex-1 items-center justify-center gap-2 mb-1">
                      <span class="text-[var(--text-terceary)] text-sm font-semibold mr-4">
                        {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
                      </span>
                  </div>
                  <!-- fullscreen -->
                  <div class="flex-1 flex items-center justify-end">
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

          <!-- audio -->
          <!-- eslint-disable-next-line vuejs-accessibility/media-has-caption -->
          <div
            v-else-if="currentBlobURL && file.contentType.startsWith('audio/')"
            class="
              relative
              flex flex-col items-center justify-center
              w-full h-full
              bg-gradient-to-t from-black to-transparent
              rounded-2xl gap-4"
          >
            <!-- cover vinil -->
            <div
              @click="togglePlay"
              @keydown.space.prevent="togglePlay"
              class="cursor-pointer"
              :class="['relative w-96 h-96', isPlaying ? 'vinil-spin' : 'vinil-paused']
              "
            >
              <img
                src="/icon/icon-vinil.svg"
                alt="vinil"
                class="w-full h-full"
              />
              <div class="absolute inset-0 flex items-center justify-center overflow-hidden">
                <img
                  v-if="audioCover"
                  :src="audioCover"
                  alt="Audio cover"
                  class="w-40 h-40 scale-[1.2] object-cover rounded-full shadow-lg border-2 border-white/60"
                />
                <div
                  v-else
                  class="
                    w-44 h-44 rounded-full overflow-hidden flex items-center justify-center
                    bg-gradient-to-b from-pink-900 to-pink-900
                    shadow-lg border-4 border-white/70
                  "
                >
                  <img
                    src="/icon/icon-audio.svg"
                    alt="Audio"
                    class="w-full h-full scale-[1.35]"
                  />
                </div>
              </div>
              <div class="absolute inset-0 flex items-center justify-center z-10">
                <div class="w-4 h-4 bg-black rounded-full"></div>
              </div>
            </div>
            <audio
              ref="audioRef"
              :src="currentBlobURL"
              class="w-full"
              @play="isPlaying = true"
              @pause="isPlaying = false"
              @ended="isPlaying = false"
              @timeupdate="onTimeUpdate"
              @loadedmetadata="onLoadedMetadata"
            >
              <track kind="captions" />
            </audio>
            <!-- controles -->
            <div
              class="
                absolute bottom-0 left-0 right-0
                flex flex-col
                px-4 pb-2 pt-8 gap-2
                transtion-all duration-300
              "
              :class="isFullscreen
                ? (showPreviewHeader ? 'opacity-100'
                : 'opacity-0 pointer-events-none') : 'opacity-100'
              "
              style="background: linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, transparent 100%)
              "
            >
              <!-- seek -->
              <div
                @mousedown="onSeekStart"
                @blur="onSeekEnd"
                role="slider"
                tabindex="0"
                :aria-valuenow="Math.round(progressPercent)"
                aria-valuemin="0"
                aria-valuemax="100"
                class="seek-bar relative mx-2 h-1 bg-[var(--text-terceary)] rounded-full cursor-pointer select-none"
              >
                <div class="absolute top-0 left-0 h-full rounded-full bg-[var(--color-primary)]" :style="{ width: progressPercent + '%' }" />
                <div class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[var(--color-primary)]" :style="{ left: progressPercent + '%' }" />
              </div>
              <!-- botones -->
              <div class=" flex items-center justify-between">
                <!-- play/pause + volumen -->
                <div class="flex flex-1 items-center gap-2 mb-1">
                  <button
                    @click="togglePlay"
                    class="
                      border border-transparent
                      text-[var(--color-primary)] font-medium text-sm
                      p-1 rounded-xl grayscale
                      hover:text-[var(--text)]
                      hover:border-[var(--color-primary)]
                      hover:grayscale-0
                      transition-all duration-400
                    "
                  >
                    <img v-if="isPlaying" src="/icon/icon-pause.svg" alt="Pause" class="h-6 w-6" />
                    <img v-else src="/icon/icon-play.svg" alt="Play" class="h-6 w-6" />
                  </button>

                  <!--volumen-->
                  <div
                    class="
                      group
                      relative flex items-center
                      border border-transparent gap-2
                      py-1 px-1.5 rounded-xl grayscale

                      hover:border-[var(--color-primary)]
                      hover:grayscale-0
                      transition-all duration-300
                    "
                  >
                    <!-- Botón volumen -->
                    <button @click="toggleMute">
                      <img v-if="isMuted" src="/icon/icon-mute.svg" alt="Unmute" class="h-6" />
                      <img v-else src="/icon/icon-sound.svg" alt="Mute" class="h-6" />
                    </button>

                    <!-- Slider: oculto por defecto, visible al hacer hover en el grupo -->
                    <div class="
                      w-0 h-5 overflow-hidden opacity-0 flex items-center justify-center
                      group-hover:w-24 group-hover:opacity-100
                      transition-all duration-300 ease-in-out
                    ">
                      <label class="sr-only" for="volume-slider">Volumen</label>
                      <input
                        id="volume-slider"
                        type="range" min="0" max="1" step="0.01"
                        :value="volume"
                        @input="volume = parseFloat(($event.target as HTMLInputElement).value); onVolumeChange()"
                        class="volume-slider w-24"
                        :style="{
                          background: `linear-gradient(to right, var(--color-primary)
                          ${volume * 100}%, var(--text-terceary) ${volume * 100}%)`
                        }"
                      />
                    </div>
                  </div>
                </div>
                <!-- timer -->
                <div class="flex flex-1 items-center justify-center gap-2 mb-1">
                  <span class="text-[var(--text-terceary)] text-sm font-semibold mr-4">
                    {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
                  </span>
                </div>
                <div class="flex flex-1 items-center gap-2 mb-1"></div>
              </div>
            </div>
          </div>

          <!-- text -->
          <pre
            v-else-if="currentBlobURL && file.contentType.startsWith('text/')"
            class="
              w-full h-full overflow-auto
              text-sm text-white font-mono
              bg-white/5 rounded-2xl
              p-6 leading-relaxed
              whitespace-pre-wrap break-words
            "
          >{{ textContent }}
          </pre>

          <!-- code -->
          <pre
          v-else-if="currentBlobURL && (
            file.contentType.startsWith('text/') ||
            file.name?.endsWith('.vue') ||
            file.name?.endsWith('.ts') ||
            file.name?.endsWith('.js') ||
            file.name?.endsWith('.py')
          )"
            class="
              w-full h-full overflow-auto
              text-sm text-emerald-300 font-mono
              bg-white/5 rounded-2xl
              p-6 leading-relaxed
              whitespace-pre-wrap break-words
            "
          >{{ textContent }}
          </pre>

          <!-- pdf -->
          <embed
            v-else-if="currentBlobURL && file.contentType === 'application/pdf'"
            :src="currentBlobURL"
            type="application/pdf"
            class="w-full h-full rounded-2xl"
          />
          <!-- other -->
          <div v-else class="flex flex-col pb-10 items-center text-[var(--text-terceary)] text-xs text-center sm:text-md">
            <span class="font-semibold text-[var(--text-terceary)] text-5xl mb-8 ">Ups! :(</span>
            <img v-if="file.contentType === 'application/msword' || file.contentType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'" src="/icon/icon-doc.svg" alt="doc" class="h-20 w-20" />
            <img v-else-if="file.contentType === 'application/vnd.ms-excel' || file.contentType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'" src="/icon/icon-excel.svg" alt="excel" class="h-20 w-20" />
            <img v-else-if="file.contentType === 'application/vnd.ms-powerpoint' || file.contentType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'" src="/icon/icon-ppt.svg" alt="ppt" class="h-20 w-20" />
            <span class="font-semibold text-white text-xl mb-5 sm:text-3xl"> {{ file.name }} </span>
            <p>Sorry, a preview for the file
              is not available at the moment.
              <br>We recommend downloading it to view its contents...</p>
          </div>
        </div>

        <!-- zoom controls -->
        <div v-if="file.contentType?.startsWith('image/')"
          class="
              fixed bottom-0 mb-2
              transition-all duration-500
            "
          :class="[
            showPreviewHeader
              ? 'opacity-100 -translate-y-0'
              : 'opacity-0 translate-y-full pointer-events-none',
            isFullscreen
              ?'mb-1'
              :''
            ]
          "
        >
          <!-- zoom controls container -->
          <div
            class="
              flex justify-center items-center
              mb-1 rounded-2xl p-1 bg-black/0 backdrop-blur-sm
              hover:backdrop-blur-md hover:bg-black/60
              transition-all duration-400
            "
          >
            <!-- reset zoom -->
            <div class="flex justify-end">
              <button
                @click="resetZoom"
                @keydown.enter="resetZoom"
                class="
                  border border-transparent
                  text-[var(--color-primary)] font-medium text-sm
                  p-1
                  rounded-xl
                  invert brightness-0
                  opacity-70

                  hover:opacity-100
                  hover:invert-0 hover:brightness-100
                  hover:text-[var(--text)]
                  hover:border-[var(--color-primary)]
                  transition-all duration-300
                "
              >
                <img
                  src="/icon/icon-reset-zoom.svg"
                  alt="reset zoom"
                  class="w-5 h-5"/>
              </button>
            </div>
            <!-- zoom in/out -->
            <div class="flex-2 space-x-6 flex items-center">
              <button
                @click="zoomOut"
                :disabled="zoomLevel <= 0.25"
                class="
                  border border-transparent
                  text-[var(--color-primary)] font-medium text-sm
                  p-1 ml-1
                  rounded-xl
                  invert brightness-0
                  opacity-70

                  hover:opacity-100
                  hover:invert-0 hover:brightness-100
                  hover:text-[var(--text)]
                  hover:border-[var(--color-primary)]

                  transition-all duration-300
                  disabled:opacity-20 disabled:cursor-not-allowed
                "
              >
                <img src="/icon/icon-less.svg" alt="plus" class="w-5"/>
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
                  border border-transparent
                  text-[var(--color-primary)] font-medium text-sm
                  p-1 mr-1
                  rounded-xl
                  invert brightness-0
                  opacity-70

                  hover:opacity-100
                  hover:invert-0 hover:brightness-100
                  hover:text-[var(--text)]
                  hover:border-[var(--color-primary)]

                  transition-all duration-300
                  disabled:opacity-20 disabled:cursor-not-allowed
                "
              >
                <img src="/icon/icon-plus.svg" alt="plus" class="w-5"/>
              </button>
            </div>
            <!-- fullscreen -->
            <div class="flex items-center">
              <button
                @click="toggleFullscreen"
                class="
                  border border-transparent
                  text-[var(--color-primary)] font-medium text-sm
                  p-1 ml-1
                  rounded-xl
                  invert brightness-0
                  opacity-70

                  hover:opacity-100
                  hover:invert-0 hover:brightness-100
                  hover:text-[var(--text)]
                  hover:border-[var(--color-primary)]
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
    </div>
  </Teleport>
</template>

<script setup lang="ts">
/* eslint-disable no-undef, no-use-before-define */
import {
  ref,
  computed,
  watch,
  onMounted,
  onUnmounted,
} from 'vue';
import { useStore } from 'vuex';
import { FileI } from '@/store/files/state';

const props = defineProps<{
  modelValue: FileI;
  files: FileI[];
  disableNavigation?: boolean;
}>();

const emit = defineEmits([
  'update:modelValue',
  'close',
  'open-info',
  'copy-link',
  'download',
]);

const store = useStore();

const file = computed(() => props.modelValue);
const files = computed(() => props.files);
const currentPreviewIndex = computed(() => files.value.findIndex((f) => f.id === file.value.id));

const audioCover = ref<string | null>(null);
const currentBlobURL = ref<string | null>(null);
const textContent = ref<string | null>(null);
const isPlaying = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const volume = ref(0.8);
const isMuted = ref(false);
const previousVolume = ref(1);
const isSeeking = ref(false);
const isPanning = ref(false);
const panStart = ref({ x: 0, y: 0 });
const panOffset = ref({ x: 0, y: 0 });
const zoomLevel = ref(1);
const isFullscreen = ref(false);
const showPreviewHeader = ref(true);
const touchStartX = ref(0);
const imageRef = ref<HTMLImageElement | null>(null);
const videoRef = ref<HTMLVideoElement | null>(null);
const audioRef = ref<HTMLAudioElement | null>(null);
const imageDimensions = ref<{ width: number; height: number } | null>(null);

let hideHeaderTimeout: ReturnType<typeof setTimeout> | null = null;
const progressPercent = computed(() => (duration.value ? (currentTime.value / duration.value) * 100 : 0));

function closeModal() {
  if (isFullscreen.value) toggleFullscreen();
  emit('close');
}

function previewNext() {
  if (props.disableNavigation) return;
  const next = files.value[currentPreviewIndex.value + 1];
  if (next) {
    emit('update:modelValue', next);
    resetZoom();
  }
}

function previewPrev() {
  if (props.disableNavigation) return;
  const prev = files.value[currentPreviewIndex.value - 1];
  if (prev) {
    emit('update:modelValue', prev);
    resetZoom();
  }
}

async function extractAudioCover(blob: Blob) {
  audioCover.value = null;
  try {
    const buffer = await blob.arrayBuffer();
    const view = new DataView(buffer);

    const id3 = String.fromCharCode(view.getUint8(0), view.getUint8(1), view.getUint8(2));
    if (id3 !== 'ID3') return;

    let offset = 10;
    const end = Math.min(buffer.byteLength, 500000);

    while (offset < end) {
      const frameId = String.fromCharCode(
        view.getUint8(offset),
        view.getUint8(offset + 1),
        view.getUint8(offset + 2),
        view.getUint8(offset + 3),
      );

      const frameSize = view.getUint32(offset + 4);
      if (frameSize === 0) break;

      if (frameId === 'APIC') {
        let pos = offset + 10;

        pos += 1; // encoding byte

        while (view.getUint8(pos) !== 0) pos += 1; // mime type
        pos += 1; // null byte

        pos += 1; // picture type

        while (view.getUint8(pos) !== 0) pos += 1; // description
        pos += 1; // null byte

        const imageData = new Uint8Array(buffer, pos, offset + 10 + frameSize - pos);
        const imageBlob = new Blob([imageData]);
        audioCover.value = URL.createObjectURL(imageBlob);
        return;
      }

      offset += 10 + frameSize;
    }
  } catch (e) {
    console.warn('No se pudo extraer la portada:', e);
  }
}

async function getBase64(currentFile: FileI) {
  const base64 = await store.dispatch('files/getCacheFile', { id: currentFile.id });

  if (base64) {
    const blob = await fetch(base64).then((r) => r.blob());
    const url = URL.createObjectURL(blob);
    currentBlobURL.value = url;

    if (currentFile.contentType.startsWith('audio/')) {
      await extractAudioCover(blob);
    }

    if (
      currentFile.contentType.startsWith('text/') || currentFile.name?.endsWith('.vue') || currentFile.name?.endsWith('.ts') || currentFile.name?.endsWith('.js') || currentFile.name?.endsWith('.py')
    ) {
      textContent.value = await blob.text();
    }

    if (currentFile.contentType.startsWith('application/json')) {
      try {
        const raw = await blob.text();
        textContent.value = JSON.stringify(JSON.parse(raw), null, 2);
      } catch {
        textContent.value = await blob.text();
      }
    }

    return url;
  }

  await store.dispatch('files/saveCacheFile', currentFile);
  return '';
}

function togglePlay() {
  const media = videoRef.value || audioRef.value;
  if (!media) return;
  if (isPlaying.value) {
    media.pause(); isPlaying.value = false;
  } else {
    media.play(); isPlaying.value = true;
  }
}

function onTimeUpdate() {
  const media = videoRef.value || audioRef.value;
  currentTime.value = media?.currentTime ?? 0;
}

function onLoadedMetadata() {
  const media = videoRef.value || audioRef.value;
  if (!media) return;
  duration.value = media.duration;
  media.volume = volume.value;
}

function seekFromEvent(e: MouseEvent) {
  const media = videoRef.value || audioRef.value;
  if (!media || !duration.value || !Number.isFinite(duration.value)) return;

  const bar = document.querySelector('.seek-bar') as HTMLElement;
  if (!bar) return;

  const rect = bar.getBoundingClientRect();
  const ratio = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
  const newTime = ratio * media.duration;

  if (!Number.isFinite(newTime)) return;
  media.currentTime = newTime;
}

function onSeekMove(e: MouseEvent) {
  e.preventDefault();
  if (!isSeeking.value) return;
  seekFromEvent(e);
}

function onSeekEnd() {
  if (!isSeeking.value) return;
  isSeeking.value = false;
  const media = videoRef.value || audioRef.value;
  if (media) {
    media.play();
    isPlaying.value = true;
  }

  document.removeEventListener('mousemove', onSeekMove);
  document.removeEventListener('mouseup', onSeekEnd);
}

function onSeekStart(e: MouseEvent) {
  e.preventDefault();
  const media = videoRef.value || audioRef.value;
  if (media) {
    media.pause();
    isPlaying.value = false;
  }
  isSeeking.value = true;
  seekFromEvent(e);

  document.addEventListener('mousemove', onSeekMove);
  document.addEventListener('mouseup', onSeekEnd);
}

function toggleMute() {
  const media = videoRef.value || audioRef.value;
  if (!media) return;

  isMuted.value = !isMuted.value;

  if (isMuted.value) {
    previousVolume.value = volume.value || 1;
    volume.value = 0;
    media.volume = 0;
    media.muted = true;
  } else {
    volume.value = previousVolume.value;
    media.volume = previousVolume.value;
    media.muted = false;
  }
}

function onVolumeChange() {
  const media = videoRef.value || audioRef.value;
  if (!media) return;
  media.volume = volume.value;
  isMuted.value = volume.value === 0;
}

function getRenderedImageSize() {
  const img = imageRef.value;
  if (!img) return { w: 0, h: 0 };

  const rect = img.getBoundingClientRect();
  return {
    w: rect.width / zoomLevel.value,
    h: rect.height / zoomLevel.value,
  };
}

function clampPan(zoom: number) {
  const img = imageRef.value;
  if (!img) return;

  const container = img.parentElement;
  if (!container) return;

  const containerW = container.clientWidth;
  const containerH = container.clientHeight;

  const { w, h } = getRenderedImageSize();

  const scaledW = w * zoom;
  const scaledH = h * zoom;

  const maxX = Math.max(0, (scaledW - containerW) / 2);
  const maxY = Math.max(0, (scaledH - containerH) / 2);

  panOffset.value = {
    x: Math.min(maxX, Math.max(-maxX, panOffset.value.x)),
    y: Math.min(maxY, Math.max(-maxY, panOffset.value.y)),
  };
}

function onPanStart(e: MouseEvent) {
  const img = imageRef.value;
  if (!img) return;

  const container = img.parentElement;
  if (!container) return;

  const { w, h } = getRenderedImageSize();
  const scaledW = w * zoomLevel.value;
  const scaledH = h * zoomLevel.value;

  const hasOverflow = scaledW > container.clientWidth || scaledH > container.clientHeight;
  if (!hasOverflow) return;

  isPanning.value = true;
  panStart.value = {
    x: e.clientX - panOffset.value.x,
    y: e.clientY - panOffset.value.y,
  };
  e.preventDefault();
}

function onPanMove(e: MouseEvent) {
  if (!isPanning.value) return;

  const img = imageRef.value;
  if (!img) return;

  const container = img.parentElement;
  if (!container) return;

  const containerW = container.clientWidth;
  const containerH = container.clientHeight;

  const { w, h } = getRenderedImageSize();

  const scaledW = w * zoomLevel.value;
  const scaledH = h * zoomLevel.value;

  const maxX = Math.max(0, (scaledW - containerW) / 2);
  const maxY = Math.max(0, (scaledH - containerH) / 2);

  const rawX = e.clientX - panStart.value.x;
  const rawY = e.clientY - panStart.value.y;

  panOffset.value = {
    x: Math.min(maxX, Math.max(-maxX, rawX)),
    y: Math.min(maxY, Math.max(-maxY, rawY)),
  };
}

function onPanEnd() {
  isPanning.value = false;
}

function zoomIn() {
  zoomLevel.value = Math.min(zoomLevel.value + 0.10, 4);
  clampPan(zoomLevel.value);
}

function zoomOut() {
  zoomLevel.value = Math.max(zoomLevel.value - 0.10, 0.10);
  clampPan(zoomLevel.value);
}

function resetZoom() {
  zoomLevel.value = 1;
  panOffset.value = { x: 0, y: 0 };
}

function onWheelZoom(e: WheelEvent) {
  if (!file.value?.contentType?.startsWith('image/')) return;
  e.preventDefault();
  if (e.deltaY < 0) zoomIn();
  else zoomOut();
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
    isFullscreen.value = true;
    resetZoom();
  } else {
    document.exitFullscreen();
    isFullscreen.value = false;
    resetZoom();
  }
}

function onFullscreenChange() {
  isFullscreen.value = !!document.fullscreenElement;
  if (!isFullscreen.value) {
    showPreviewHeader.value = true;
    if (hideHeaderTimeout) clearTimeout(hideHeaderTimeout);
  }
}

function onPreviewMouseMove(e: MouseEvent) {
  if (!isFullscreen.value) return;

  const nearTop = e.clientY < 200;
  const nearBottom = e.clientY > window.innerHeight - 200;

  if (nearTop || nearBottom) {
    showPreviewHeader.value = true;
    if (hideHeaderTimeout) clearTimeout(hideHeaderTimeout);
  } else {
    if (hideHeaderTimeout) clearTimeout(hideHeaderTimeout);
    hideHeaderTimeout = setTimeout(() => {
      showPreviewHeader.value = false;
    }, 800);
  }
}

function onTouchStart(e: TouchEvent) {
  touchStartX.value = e.touches[0].clientX;
}

function onTouchEnd(e: TouchEvent) {
  const diff = touchStartX.value - e.changedTouches[0].clientX;
  if (Math.abs(diff) < 50) return;

  if (diff > 0) {
    previewNext();
  } else {
    previewPrev();
  }
}

function formatTime(seconds: number): string {
  if (!seconds || !Number.isFinite(seconds)) return '00:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    closeModal();
    e.stopImmediatePropagation();
    return;
  }
  if (e.key === 'ArrowRight') { previewNext(); return; }
  if (e.key === 'ArrowLeft') { previewPrev(); return; }
  if (e.key === 'f' || e.key === 'F') { toggleFullscreen(); return; }
  if (e.key === 'm' || e.key === 'M') { toggleMute(); return; }
  if (e.key === ' ' || e.key === 'Spacebar') {
    togglePlay();
    e.preventDefault();
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
  document.addEventListener('fullscreenchange', onFullscreenChange);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
  document.removeEventListener('fullscreenchange', onFullscreenChange);
});

watch(() => props.modelValue, async (newFile) => {
  isPlaying.value = false;
  progressPercent.value = 0;
  volume.value = 1;
  isMuted.value = false;
  previousVolume.value = 1;
  audioCover.value = null;
  panOffset.value = { x: 0, y: 0 };
  isPanning.value = false;
  zoomLevel.value = 1;
  imageDimensions.value = null;
  duration.value = 0;

  if (!newFile) return;

  getBase64(newFile);

  if (newFile.contentType?.startsWith('image/')) {
    const base64 = await store.dispatch('files/getCacheFile', { id: newFile.id });
    if (!base64) return;

    const img = new Image();
    img.src = base64;
    img.onload = () => {
      imageDimensions.value = { width: img.naturalWidth, height: img.naturalHeight };
    };
  }

  if (newFile.contentType?.startsWith('audio/') || newFile.contentType?.startsWith('video/')) {
    const base64 = await store.dispatch('files/getCacheFile', { id: newFile.id });
    if (!base64) return;

    const media = document.createElement('video');
    media.src = base64;
    media.addEventListener('loadedmetadata', () => {
      duration.value = media.duration;
      if (newFile.contentType?.startsWith('video/') && media.videoWidth && media.videoHeight) {
        imageDimensions.value = { width: media.videoWidth, height: media.videoHeight };
      }
    });
  }
}, { immediate: true });

</script>

<style scoped>
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

@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.vinil-spin {
  animation: spin-slow 10s linear infinite;
}

.vinil-paused {
  animation: spin-slow 10s linear paused;
}
</style>
