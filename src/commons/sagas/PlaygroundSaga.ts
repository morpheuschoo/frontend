import type { FSModule } from 'browserfs/dist/node/core/FS';
import { Chapter } from 'js-slang/dist/types';
import { compressToEncodedURIComponent } from 'lz-string';
import qs from 'query-string';
import { call, delay, put, race, select } from 'redux-saga/effects';
import CseMachine from 'src/features/cseMachine/CseMachine';
import { CseMachine as JavaCseMachine } from 'src/features/cseMachine/java/CseMachine';

import PlaygroundActions from '../../features/playground/PlaygroundActions';
import {
  isSchemeLanguage,
  isSourceLanguage,
  type OverallState
} from '../application/ApplicationTypes';
import { retrieveFilesInWorkspaceAsRecord } from '../fileSystem/utils';
import { combineSagaHandlers } from '../redux/utils';
import SideContentActions from '../sideContent/SideContentActions';
import { SideContentType } from '../sideContent/SideContentTypes';
import Constants from '../utils/Constants';
import { showSuccessMessage, showWarningMessage } from '../utils/notifications/NotificationsHelper';
import WorkspaceActions from '../workspace/WorkspaceActions';
import { selectWorkspace } from './SafeEffects';

const PlaygroundSaga = combineSagaHandlers({
  [PlaygroundActions.generateLzString.type]: updateQueryString,
  [PlaygroundActions.shortenURL.type]: function* ({ payload: keyword }) {
    const queryString = yield select((state: OverallState) => state.playground.queryString);
    const errorMsg = 'ERROR';

    let resp, timeout;

    //we catch and move on if there are errors (plus have a timeout in case)
    try {
      const { result, hasTimedOut } = yield race({
        result: call(shortenURLRequest, queryString, keyword),
        hasTimedOut: delay(10000)
      });

      resp = result;
      timeout = hasTimedOut;
    } catch (_) {}

    if (!resp || timeout) {
      yield put(PlaygroundActions.updateShortURL(errorMsg));
      return yield call(showWarningMessage, 'Something went wrong trying to create the link.');
    }

    if (resp.status !== 'success' && !resp.shorturl) {
      yield put(PlaygroundActions.updateShortURL(errorMsg));
      return yield call(showWarningMessage, resp.message);
    }

    if (resp.status !== 'success') {
      yield call(showSuccessMessage, resp.message);
    }
    yield put(PlaygroundActions.updateShortURL(Constants.urlShortenerBase + resp.url.keyword));
  },
  [SideContentActions.visitSideContent.type]: function* ({
    payload: { newId, prevId, workspaceLocation }
  }) {
    if (workspaceLocation !== 'playground' || newId === prevId) return;

    // Do nothing when clicking the mobile 'Run' tab while on the stepper tab.
    if (prevId === SideContentType.substVisualizer && newId === SideContentType.mobileEditorRun) {
      return;
    }

    const {
      context: { chapter: playgroundSourceChapter },
      editorTabs
    } = yield* selectWorkspace('playground');

    if (prevId === SideContentType.substVisualizer) {
      if (newId === SideContentType.mobileEditorRun) return;
      const hasBreakpoints = editorTabs.find(({ breakpoints }) => breakpoints.find(x => !!x));

      if (!hasBreakpoints) {
        yield put(WorkspaceActions.toggleUsingSubst(false, workspaceLocation));
        yield put(WorkspaceActions.clearReplOutput(workspaceLocation));
      }
    }

    if (newId !== SideContentType.cseMachine) {
      yield put(WorkspaceActions.toggleUsingCse(false, workspaceLocation));
      yield call([CseMachine, CseMachine.clearCse]);
      yield call([JavaCseMachine, JavaCseMachine.clearCse]);
      yield put(WorkspaceActions.updateCurrentStep(-1, workspaceLocation));
      yield put(WorkspaceActions.updateStepsTotal(0, workspaceLocation));
      yield put(WorkspaceActions.toggleUpdateCse(true, workspaceLocation));
      yield put(WorkspaceActions.setEditorHighlightedLines(workspaceLocation, 0, []));
    }

    if (playgroundSourceChapter === Chapter.FULL_JAVA && newId === SideContentType.cseMachine) {
      yield put(WorkspaceActions.toggleUsingCse(true, workspaceLocation));
    }

    if (
      isSourceLanguage(playgroundSourceChapter) &&
      (newId === SideContentType.substVisualizer || newId === SideContentType.cseMachine)
    ) {
      if (playgroundSourceChapter <= Chapter.SOURCE_2) {
        yield put(WorkspaceActions.toggleUsingSubst(true, workspaceLocation));
      } else {
        yield put(WorkspaceActions.toggleUsingCse(true, workspaceLocation));
      }
    }

    if (newId === SideContentType.upload) {
      yield put(WorkspaceActions.toggleUsingUpload(true, workspaceLocation));
    } else {
      yield put(WorkspaceActions.toggleUsingUpload(false, workspaceLocation));
    }

    if (isSchemeLanguage(playgroundSourceChapter) && newId === SideContentType.cseMachine) {
      yield put(WorkspaceActions.toggleUsingCse(true, workspaceLocation));
    }
  }
});

export default PlaygroundSaga;

function* updateQueryString() {
  const fileSystem: FSModule = yield select(
    (state: OverallState) => state.fileSystem.inBrowserFileSystem
  );
  const files: Record<string, string> = yield call(
    retrieveFilesInWorkspaceAsRecord,
    'playground',
    fileSystem
  );

  const {
    activeEditorTabIndex,
    context: { chapter, variant },
    editorTabs,
    execTime,
    externalLibrary: external,
    isFolderModeEnabled
  } = yield* selectWorkspace('playground');

  const editorTabFilePaths = editorTabs
    .map(editorTab => editorTab.filePath)
    .filter((filePath): filePath is string => filePath !== undefined);

  const newQueryString = qs.stringify({
    isFolder: isFolderModeEnabled,
    files: compressToEncodedURIComponent(qs.stringify(files)),
    tabs: editorTabFilePaths.map(compressToEncodedURIComponent),
    tabIdx: activeEditorTabIndex,
    chap: chapter,
    variant,
    ext: external,
    exec: execTime
  });
  yield put(PlaygroundActions.changeQueryString(newQueryString));
}

/**
 * Gets short url from microservice
 * @returns {(Response|null)} Response if successful, otherwise null.
 */
export async function shortenURLRequest(
  queryString: string,
  keyword: string
): Promise<Response | null> {
  const url = `${window.location.protocol}//${window.location.host}/playground#${queryString}`;

  const params = {
    signature: Constants.urlShortenerSignature,
    action: 'shorturl',
    format: 'json',
    keyword,
    url
  };
  const fetchOpts: RequestInit = {
    method: 'POST',
    body: Object.entries(params).reduce((formData, [k, v]) => {
      formData.append(k, v!);
      return formData;
    }, new FormData())
  };

  const resp = await fetch(`${Constants.urlShortenerBase}yourls-api.php`, fetchOpts);
  if (!resp || !resp.ok) {
    return null;
  }

  const res = await resp.json();
  return res;
}
