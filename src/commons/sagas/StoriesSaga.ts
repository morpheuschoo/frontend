import type { Context } from 'js-slang';
import { call, put, select } from 'redux-saga/effects';
import StoriesActions from 'src/features/stories/StoriesActions';
import {
  deleteStory,
  deleteUserUserGroups,
  getAdminPanelStoriesUsers,
  getStories,
  getStoriesUser,
  getStory,
  postStory,
  putStoriesUserRole,
  updateStory
} from 'src/features/stories/storiesComponents/BackendAccess';
import type { StoryData, StoryListView, StoryView } from 'src/features/stories/StoriesTypes';

import SessionActions from '../application/actions/SessionActions';
import { type OverallState, StoriesRole } from '../application/ApplicationTypes';
import { Tokens } from '../application/types/SessionTypes';
import { combineSagaHandlers } from '../redux/utils';
import { resetSideContent } from '../sideContent/SideContentActions';
import { actions } from '../utils/ActionsHelper';
import { showSuccessMessage, showWarningMessage } from '../utils/notifications/NotificationsHelper';
import { defaultStoryContent } from '../utils/StoriesHelper';
import { selectTokens } from './BackendSaga';
import { evalCodeSaga } from './WorkspaceSaga/helpers/evalCode';

const StoriesSaga = combineSagaHandlers({
  [StoriesActions.getStoriesList.type]: {
    takeLatest: function* () {
      const tokens: Tokens = yield selectTokens();
      const allStories: StoryListView[] = yield call(async () => {
        const resp = await getStories(tokens);
        return resp ?? [];
      });

      yield put(actions.updateStoriesList(allStories));
    }
  },
  [StoriesActions.setCurrentStoryId.type]: function* (action) {
    const tokens: Tokens = yield selectTokens();
    const storyId = action.payload;
    if (storyId) {
      const story: StoryView = yield call(getStory, tokens, storyId);
      yield put(actions.setCurrentStory(story));
    } else {
      const defaultStory: StoryData = {
        title: '',
        content: defaultStoryContent,
        pinOrder: null
      };
      yield put(actions.setCurrentStory(defaultStory));
    }
  },
  [StoriesActions.createStory.type]: function* (action) {
    const tokens: Tokens = yield selectTokens();
    const story = action.payload;
    const userId: number | undefined = yield select((state: OverallState) => state.stories.userId);

    if (userId === undefined) {
      yield call(showWarningMessage, 'Failed to create story: Invalid user');
      return;
    }

    const createdStory: StoryView | null = yield call(
      postStory,
      tokens,
      userId,
      story.title,
      story.content,
      story.pinOrder
    );

    // TODO: Check correctness
    if (createdStory) {
      yield put(actions.setCurrentStoryId(createdStory.id));
    }

    yield put(actions.getStoriesList());
  },
  [StoriesActions.saveStory.type]: function* (action) {
    const tokens: Tokens = yield selectTokens();
    const { story, id } = action.payload;
    const updatedStory: StoryView | null = yield call(
      updateStory,
      tokens,
      id,
      story.title,
      story.content,
      story.pinOrder
    );

    // TODO: Check correctness
    if (updatedStory) {
      yield put(actions.setCurrentStory(updatedStory));
    }

    yield put(actions.getStoriesList());
  },

  [StoriesActions.deleteStory.type]: function* (action) {
    const tokens: Tokens = yield selectTokens();
    const storyId = action.payload;
    yield call(deleteStory, tokens, storyId);

    yield put(actions.getStoriesList());
  },

  [StoriesActions.getStoriesUser.type]: function* () {
    const tokens: Tokens = yield selectTokens();
    const me: {
      id: number;
      name: string;
      groupId: number;
      groupName: string;
      role: StoriesRole;
    } | null = yield call(getStoriesUser, tokens);

    if (!me) {
      yield put(actions.setCurrentStoriesUser(undefined, undefined));
      yield put(actions.setCurrentStoriesGroup(undefined, undefined, undefined));
      return;
    }
    yield put(actions.setCurrentStoriesUser(me.id, me.name));
    yield put(actions.setCurrentStoriesGroup(me.groupId, me.groupName, me.role));
  },
  [StoriesActions.evalStory.type]: function* (action) {
    const env = action.payload.env;
    const code = action.payload.code;
    const execTime: number = yield select(
      (state: OverallState) => state.stories.envs[env].execTime
    );
    const context: Context = yield select((state: OverallState) => state.stories.envs[env].context);
    const codeFilePath = '/code.js';
    const codeFiles = {
      [codeFilePath]: code
    };
    yield put(resetSideContent(`stories.${env}`));
    yield call(
      evalCodeSaga,
      codeFiles,
      codeFilePath,
      context,
      execTime,
      action.type,
      'stories',
      env
    );
  },
  [StoriesActions.fetchAdminPanelStoriesUsers.type]: function* (action) {
    const tokens: Tokens = yield selectTokens();

    const storiesUsers = yield call(getAdminPanelStoriesUsers, tokens);

    if (storiesUsers) {
      yield put(actions.setAdminPanelStoriesUsers(storiesUsers));
    }
  },
  [SessionActions.updateStoriesUserRole.type]: function* (action) {
    const tokens: Tokens = yield selectTokens();
    const { userId, role } = action.payload;

    const resp: Response | null = yield call(putStoriesUserRole, tokens, userId, role);

    if (resp) {
      yield put(actions.fetchAdminPanelStoriesUsers());
      yield call(showSuccessMessage, 'Role updated!');
    }
  },
  [SessionActions.deleteStoriesUserUserGroups.type]: function* (action) {
    const tokens: Tokens = yield selectTokens();
    const { userId } = action.payload;

    const resp: Response | null = yield call(deleteUserUserGroups, tokens, userId);
    if (resp) {
      yield put(actions.fetchAdminPanelStoriesUsers());
      yield call(showSuccessMessage, 'Stories user deleted!');
    }
  }
});

export default StoriesSaga;
