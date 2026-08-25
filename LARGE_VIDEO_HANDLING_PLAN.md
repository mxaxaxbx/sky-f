# Large Video Handling Plan

## Problem Analysis

**Issue:** Chrome crashes (aw-snap-chrome-error) when attempting to preview large video files.

**Root Cause:** Loading entire large video files into memory/DOM causes:
- Browser memory exhaustion
- Render thread blocking
- Timeout/crash when video codec tries to process massive data at once

---

## Solution Overview

Implement a **chunked streaming architecture** where:
- Backend serves video in HTTP 206 Range-based chunks
- Frontend streams progressively instead of loading entire file
- Preview mode validates file size upfront

---

## Backend Implementation

### 1. Video Validation & Limits

**File:** `src/middleware/videoValidation.ts` (or similar)

```
- Add max video file size constant (e.g., 2GB limit)
- Add max video dimension/bitrate checks
- Return 413 Payload Too Large for oversized files
- Return 400 Bad Request with clear error message
```

**Endpoint Response:**
```json
{
  "error": "Video file too large",
  "maxSize": "2GB",
  "fileSize": "3.5GB"
}
```

### 2. HTTP Range Request Support

**File:** Modify video serving endpoint (likely in your file/storage controller)

**Requirements:**
- Detect `Range` header in request (format: `bytes=start-end`)
- Return `206 Partial Content` with:
  - `Content-Range: bytes start-end/total`
  - `Content-Length: chunk-size`
  - `Accept-Ranges: bytes`
- Support multiple ranges for adaptive playback

**Example:**
```
Request:  Range: bytes=0-1048575
Response: 206 Partial Content
          Content-Range: bytes 0-1048575/5242880000
          Content-Length: 1048576
```

### 3. Video Metadata Extraction (Optional but Recommended)

**File:** Separate endpoint `/api/videos/:id/metadata`

- Duration
- Resolution
- Bitrate
- Format/codec info
- File size

**Purpose:** Frontend can warn user before attempting preview

---

## Frontend Implementation

### 1. Pre-Preview Size Validation

**File:** `src/components/app/preview-modal.vue` (your selected file)

```javascript
// Before showing video preview
const MAX_PREVIEW_SIZE = 500 * 1024 * 1024; // 500MB for preview

if (file.size > MAX_PREVIEW_SIZE) {
  showWarning("Video too large for preview, will stream");
  // Show alternative: download link, metadata viewer, etc.
}
```

### 2. Update Video Element to Support Streaming

**Modifications to preview-modal.vue:**

Replace direct `src` binding with:
```vue
<!-- Current approach (problematic) -->
<video :src="currentBlobURL" />

<!-- New approach: Use MediaSource API or stream chunks -->
<video 
  ref="videoRef"
  @play="handlePlay"
  @seeking="handleSeeking"
  style="view-transition-name: preview-content"
>
  <source :src="streamURL" type="video/mp4" />
  <track kind="captions" />
</video>
```

### 3. Implement Streaming Strategy (Choose One)

#### **Option A: HTTP Range Requests (Recommended for simplicity)**

**File:** `src/utils/videoStreaming.ts`

```javascript
// Browser natively supports Range requests with <video> tag
// Just ensure backend implements Range header support
// No frontend code needed - browser handles it automatically

// Verify Range support:
async function checkRangeSupport(url) {
  const response = await fetch(url, { method: 'HEAD' });
  return response.headers.get('Accept-Ranges') === 'bytes';
}
```

**Pros:** Works natively with `<video>` tag, minimal code
**Cons:** Server must implement Range headers

#### **Option B: MediaSource Extensions (MSE) - More Control**

**File:** `src/utils/mediaSourceStreaming.ts`

```javascript
const mediaSource = new MediaSource();
const videoElement = document.querySelector('video');
videoElement.src = URL.createObjectURL(mediaSource);

mediaSource.addEventListener('sourceopen', async () => {
  const sourceBuffer = mediaSource.addSourceBuffer('video/mp4; codecs="avc1.42E01E,mp4a.40.2"');
  
  // Fetch and append chunks progressively
  for (let start = 0; start < fileSize; start += CHUNK_SIZE) {
    const chunk = await fetchVideoChunk(fileId, start, CHUNK_SIZE);
    sourceBuffer.appendBuffer(chunk);
    
    // Wait for buffer to update before next chunk
    await new Promise(resolve => sourceBuffer.addEventListener('updateend', resolve));
  }
  
  mediaSource.endOfStream();
});
```

**Pros:** Maximum control, can implement adaptive bitrate
**Cons:** More complex, requires chunking on backend

#### **Option C: Hybrid - Stream with Fallback**

Use Range requests with timeout fallback to MSE if needed.

### 4. Update Modal to Show Loading State

**File:** `src/components/app/preview-modal.vue`

```vue
<template>
  <div class="video-container">
    <!-- Loading indicator for large videos -->
    <div v-if="isLoadingVideo" class="loading-overlay">
      <div class="spinner"></div>
      <p>Loading large video... {{ loadingProgress }}%</p>
    </div>
    
    <video
      ref="videoRef"
      :src="videoStreamURL"
      @loadstart="isLoadingVideo = true"
      @canplay="isLoadingVideo = false"
      @progress="updateLoadingProgress"
    />
  </div>
</template>

<script setup>
const isLoadingVideo = ref(false);
const loadingProgress = ref(0);

const updateLoadingProgress = (event) => {
  const video = event.target;
  if (video.duration) {
    loadingProgress.value = Math.round(
      (video.buffered.length > 0 
        ? video.buffered.end(video.buffered.length - 1) 
        : 0) / video.duration * 100
    );
  }
};
</script>
```

---

## Implementation Steps

### Phase 1: Backend (Weeks 1-2)

1. **Setup:**
   - [ ] Add video size validation middleware
   - [ ] Add video metadata endpoint

2. **HTTP Range Support:**
   - [ ] Implement Range header detection
   - [ ] Return 206 Partial Content responses
   - [ ] Add Accept-Ranges header
   - [ ] Test with curl: `curl -r 0-1000 http://api/video`

3. **Testing:**
   - [ ] Create test videos: 100MB, 500MB, 1GB, 2GB+
   - [ ] Verify Range requests work with `ffmpeg` or similar

### Phase 2: Frontend (Weeks 2-3)

1. **Update preview-modal.vue:**
   - [ ] Add file size validation
   - [ ] Add warning message for large videos
   - [ ] Ensure Range request support (browser native)

2. **Add Loading/Progress UI:**
   - [ ] Show spinner during video buffering
   - [ ] Display buffering progress
   - [ ] Show file size and estimated load time

3. **Add User Guidance:**
   - [ ] Error message if video exceeds max preview size
   - [ ] Download link as fallback

4. **Testing:**
   - [ ] Test with 100MB, 500MB, 1GB videos
   - [ ] Monitor memory usage in DevTools
   - [ ] Test seeking through video (pause/play)
   - [ ] Test on different browsers

### Phase 3: Optimization (Week 3+)

1. **Advanced:**
   - [ ] Implement MSE for adaptive quality
   - [ ] Add bitrate detection
   - [ ] Cache metadata responses
   - [ ] Preload first chunk on hover

2. **Monitoring:**
   - [ ] Add performance metrics (time-to-first-frame, buffering events)
   - [ ] Track errors in Sentry/logging

---

## Configuration Constants

```typescript
// src/config/videoConfig.ts

export const VIDEO_CONFIG = {
  // Size limits
  MAX_UPLOAD_SIZE: 5 * 1024 * 1024 * 1024, // 5GB
  MAX_PREVIEW_SIZE: 500 * 1024 * 1024,     // 500MB
  MAX_STREAM_CHUNK: 10 * 1024 * 1024,      // 10MB chunks
  
  // Timeouts
  CHUNK_FETCH_TIMEOUT: 30000,               // 30s per chunk
  PREVIEW_LOAD_TIMEOUT: 60000,              // 60s total preview load
  
  // Quality
  MIN_BUFFER_SECONDS: 15,
  TARGET_BUFFER_SECONDS: 30,
  
  // Supported formats
  SUPPORTED_CODECS: [
    'video/mp4; codecs="avc1.42E01E,mp4a.40.2"',
    'video/webm',
  ],
};
```

---

## Error Handling

### Backend Errors

| Status | Scenario | Response |
|--------|----------|----------|
| 400 | Invalid Range header | `{ error: "Invalid range format" }` |
| 413 | File too large | `{ error: "Video exceeds max size", maxSize, fileSize }` |
| 416 | Range not satisfiable | Browser handles natively |
| 500 | Streaming error | Clear error message + fallback |

### Frontend Error Recovery

```javascript
// Auto-fallback strategies
1. If Range requests fail → Retry with full download
2. If full download fails → Show download link
3. If preview timeout → Show metadata-only view
4. If video codec unsupported → Show "incompatible format" message
```

---

## Monitoring & Metrics

**Track:**
- Successful previews by file size range
- Time to first frame
- Buffering events and durations
- Error rates by type
- User abandonment rates

**Tools:**
- Browser DevTools → Performance tab
- Sentry for error tracking
- Google Analytics for user behavior

---

## Security Considerations

- ✅ Validate file size on both backend + frontend
- ✅ Implement rate limiting on video serving endpoint
- ✅ Authenticate video access (verify user permissions)
- ✅ Log video preview attempts (audit trail)
- ✅ Sanitize file names in responses

---

## Browser Compatibility

| Browser | Range Support | MSE Support | Status |
|---------|---------------|-------------|--------|
| Chrome | ✅ | ✅ | Full support |
| Firefox | ✅ | ✅ | Full support |
| Safari | ✅ | ⚠️ | Limited MSE |
| Edge | ✅ | ✅ | Full support |

**Recommendation:** Start with Range requests (native browser support), add MSE as Phase 3 enhancement.

---

## Success Criteria

- [ ] No browser crashes with videos up to 2GB
- [ ] Preview loads within 30 seconds for videos <500MB
- [ ] User sees clear progress indicator
- [ ] Seeking works smoothly (no 30s+ delays)
- [ ] Memory usage stable (no unbounded growth)
- [ ] Graceful fallback if streaming fails
- [ ] Works on Chrome, Firefox, Safari, Edge

---

## References

- [MDN: Range Requests](https://developer.mozilla.org/en-US/docs/Web/HTTP/Range_requests)
- [MDN: MediaSource API](https://developer.mozilla.org/en-US/docs/Web/API/MediaSource)
- [HTTP 206 Partial Content](https://httpwg.org/specs/rfc7233.html)
- [Video Best Practices](https://web.dev/media-queries/)
