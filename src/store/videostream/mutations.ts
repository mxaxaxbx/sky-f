import { MutationTree } from 'vuex';

import { VideoStreamStateI, VideoMetadataI } from './state';

export const mutations: MutationTree<VideoStreamStateI> = {
  SET_VIDEOSTREAM_METADATA(state, metadata: VideoMetadataI) {
    state.metadata = metadata;
  },
};
