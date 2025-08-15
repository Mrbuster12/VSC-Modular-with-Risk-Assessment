// projection_tierX_algorithms.js (stashed; not loaded)
export const TIERX_PROJECTION_ALGOS = Object.freeze({
  version: '0.1-stashed',
  enabled: false,
  notes: 'Placeholder signatures for future projection-based clinician rendering. Not executed.',
  algorithms: {
    gazeSmoothing: { signature: 'gaze(t)->pose', status: 'stashed' },
    pupilAffectMap: { signature: 'pupil_dilation->affect_score', status: 'stashed' },
    microgestureBlend: { signature: 'emote(vec)->pose_blend', status: 'stashed' },
    bioConcordanceProjector: { signature: 'biometrics+concordance->projection_intent', status: 'stashed' }
  }
});
