import { ActionTree } from 'vuex';
import { EditorStateI } from './state';
import { RootStateI } from '../state';

export const actions: ActionTree<EditorStateI, RootStateI> = {
  async openLocalFile({ commit }) {
    if ('showOpenFilePicker' in window) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const [fileHandle] = await (window as any).showOpenFilePicker({
          types: [
            {
              description: 'Text and Markdown files',
              accept: {
                'text/plain': ['.txt'],
                'text/markdown': ['.md'],
              },
            },
          ],
          excludeAcceptAllOption: true,
          multiple: false,
        });
        const file = await fileHandle.getFile();
        const content = await file.text();

        commit('SET_FILE_HANDLE', fileHandle);
        commit('SET_CURRENT_FILE_NAME', file.name);
        commit('SET_CURRENT_FILE_CONTENT', content);
        commit('SET_FILE_SIZE', file.size);
        commit('SET_HAS_UNSAVED_CHANGES', false);
      } catch (err) {
        console.error('File open aborted or failed', err);
      }
    } else {
      await new Promise((resolve, reject) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.txt,.md';
        input.onchange = (e: Event) => {
          const target = e.target as HTMLInputElement;
          const file = target.files?.[0];
          if (!file) {
            reject(new Error('No file selected'));
            return;
          }
          const reader = new FileReader();
          reader.onload = (ev) => {
            const content = ev.target?.result as string;
            commit('SET_FILE_HANDLE', null);
            commit('SET_CURRENT_FILE_NAME', file.name);
            commit('SET_CURRENT_FILE_CONTENT', content);
            commit('SET_FILE_SIZE', file.size);
            commit('SET_HAS_UNSAVED_CHANGES', false);
            resolve(content);
          };
          reader.onerror = (err) => {
            reject(err);
          };
          reader.readAsText(file);
        };
        input.click();
      });
    }
  },

  async saveLocalFile({ state, commit }) {
    if ('showSaveFilePicker' in window) {
      try {
        let { fileHandle } = state;

        if (!fileHandle) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          fileHandle = await (window as any).showSaveFilePicker({
            suggestedName: state.currentFileName || 'document.txt',
            types: [
              {
                description: 'Text Document',
                accept: { 'text/plain': ['.txt'] },
              },
              {
                description: 'Markdown Document',
                accept: { 'text/markdown': ['.md'] },
              },
            ],
          });
          commit('SET_FILE_HANDLE', fileHandle);
          commit('SET_CURRENT_FILE_NAME', fileHandle.name);
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const writable = await (fileHandle as any).createWritable();
        await writable.write(state.currentFileContent);
        await writable.close();

        commit('SET_HAS_UNSAVED_CHANGES', false);
      } catch (err) {
        console.error('File save aborted or failed', err);
      }
    } else {
      const blob = new Blob([state.currentFileContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = state.currentFileName || 'document.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      commit('SET_HAS_UNSAVED_CHANGES', false);
    }
  },

  updateContent({ commit }, content: string) {
    commit('SET_CURRENT_FILE_CONTENT', content);
    commit('SET_HAS_UNSAVED_CHANGES', true);
  },
};
