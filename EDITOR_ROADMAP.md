# Roadmap: Adding TXT and Markdown Editing Capabilities

This roadmap outlines the steps to implement a text and Markdown file editor within the current Vue.js application using Monaco Editor and Vuex.

## Phase 1: Setup & Tool Selection
- [ ] **Install Monaco Editor:**
  - Standardize on `monaco-editor` (or a Vue 3 wrapper like `monaco-editor-vue3` / `@guolao/vue-monaco-editor`).
  - Configure Webpack/Vite plugins (e.g., `monaco-editor-webpack-plugin`) to load Monaco's web workers properly.
- [ ] **Install Markdown Parsers (Optional for preview):** Run `npm install marked` or `markdown-it` if a secondary rendered preview pane is desired.

## Phase 2: File Handling (I/O)
- [ ] **Implement File Reader:** Use the HTML5 `FileReader` API or the modern `File System Access API` to open local `.txt` and `.md` files.
- [ ] **Implement File Saver:** Create a mechanism to save edits back to the user's device (using `Blob` and `<a download>` or `showSaveFilePicker`).
- [ ] **State Management (Vuex):** Add Vuex store modules to manage:
  - Current file name.
  - Current file content.
  - "Unsaved changes" state.

## Phase 3: Component Development
- [ ] **Create `EditorComponent.vue`:**
  - Wrap the Monaco Editor instance.
  - Support two-way binding (`v-model` or equivalent) for the file content.
  - Configure Monaco for `markdown` and `plaintext` language modes.
- [ ] **Create `MarkdownPreview.vue` (Optional):**
  - If split-pane editing is desired, build a component to parse and render Markdown content in real-time.
- [ ] **Create `EditorToolbar.vue`:**
  - Add actions like Open, Save, Undo, Redo, and formatting shortcuts if applicable.

## Phase 4: App Integration
- [ ] **Create `EditorView.vue`:**
  - Assemble the Toolbar, EditorComponent, and (optionally) MarkdownPreview into a cohesive page.
- [ ] **Routing:** Add a new route in `src/router/index.ts` (e.g., `/editor`) pointing to `EditorView.vue`.
- [ ] **Navigation:** Add a link or button in the main layout (`App.vue` or navigation bar) to access the editor.

## Phase 5: Styling & Polish
- [ ] **Styling:** Style the editor container using Tailwind CSS to match the existing app theme (`tailwind.config.js`). Set Monaco to a theme matching your app (e.g., `vs-dark`).
- [ ] **Responsiveness:** Ensure the editor layout works well on mobile and desktop views.

## Phase 6: Testing & Edge Cases
- [ ] **Test File Extensions:** Ensure the app only accepts/filters `.txt` and `.md` files in the file picker.
- [ ] **Handle Large Files (GPU Acceleration):** 
  - Ensure Monaco Editor is configured to leverage the device GPU. Monaco uses hardware-accelerated rendering (canvas/WebGL where applicable) for its editor surface.
  - Optimize the editor for large text files by adjusting Monaco's layout configuration and disabling heavy features (like format on type or excessive minimap rendering) for massive files.
- [ ] **Unsaved Changes Warning:** Implement an alert if the user tries to navigate away with unsaved changes.