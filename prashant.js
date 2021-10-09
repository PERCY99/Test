import { thunk, action, persist } from 'easy-peasy';
import queryString from 'query-string';
import cookies from 'js-cookie';
import { get, isEmpty } from 'lodash-es';
import * as Sentry from '@sentry/browser';
import camelizeKeys from 'utils/camelizeKeys';
import {
  fetchQuizBySlug,
  insertVcQuizTrack,
  updateVcQuizTrack,
  insertVcQuestionAssessmentTrack,
} from 'graphql/queries/quiz';
import { isStudent } from 'utils/tokenUtils';

let classProps = queryString.parse(window.location.search).class_props;
try {
  classProps = JSON.parse(atob(classProps));
} catch (error) {
  classProps = {};
}

let teacherId = classProps.teacher_id;
let vcId = classProps.vc_id;
const storageUserSubmissions = JSON.parse(
  get(localStorage, 'userSubmissions', '{}')
);

if (!teacherId) {
  teacherId = get(storageUserSubmissions, 'teacherId');
}

if (!vcId) {
  vcId = get(storageUserSubmissions, 'vcId');
}

const defaultState = {
  // 'BI_MO_MD_L_1_Q_1': {
  //   activeQuestionSlug: null,
  //   trackId: null,
  //   quizDetails: null,
  //   quizStep: 'introduction',
  //   savedQuizResult: {},
  // }
};

const model = {
  ...defaultState,

  updateState: action((state, payload) => {
    return {
      ...state,
      ...payload,
    };
  }),

  fetchQuizBySlug: thunk((actions, payload, { getState }) => {
    const state = getState();
    const quizContent = get(state, payload);
    if (isEmpty(quizContent) || (payload && get(quizContent, 'quizDetails.slug', null) !== payload)) {
      fetchQuizBySlug(payload).then((data) => {
        let quizDetails = camelizeKeys(data);
        quizDetails = get(quizDetails, 'data.getQuiz');
        actions.updateState({
          [payload]: {
            quizDetails,
            quizStep: 'introduction',
            activeQuestionSlug: get(quizDetails, 'questions.0'),
          },
        });
      }).catch(error => error);
    } else {
      actions.updateState();
    }
  }),

  insertVcQuizTrack: thunk((actions, payload, { getState }) => {
    const state = getState();
    const quizContent = get(state, payload);
    const data = {
      quiz_id: payload,
      teacher_id: teacherId,
      vc_id: vcId,
    };
    if (vcId && teacherId && isStudent()) {
      return new Promise((resolve, reject) => {
        insertVcQuizTrack(data)
          .then((data) => {
            actions.updateState({
              [payload]: {
                ...quizContent,
                quizStep: 'question',
                trackId: get(data, 'data.insert_vc_quiz_track.id'),
                activeQuestionSlug: get(quizContent, 'quizDetails.questions.0'),
              },
            });
            // this cookie is expected by library Quiz-Component Library
            cookies.set('quizStartTime', Date.now());
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    }
    actions.updateState({
      [payload]: {
        ...quizContent,
        quizStep: 'question',
        activeQuestionSlug: get(quizContent, 'quizDetails.questions.0'),
      },
    });
  }),

  updateVcQuizTrack: thunk((actions, payload, { getState }) => {
    const { quizSlug, score, time_spent_in_ms, is_completed } = payload;
    const state = getState();
    const trackId = get(state, `${quizSlug}.trackId`);
    return new Promise((resolve, reject) => {
      if (trackId) {
        const data = {
          id: trackId,
          score,
          time_spent_in_ms,
          is_completed,
        };
        updateVcQuizTrack(data)
          .then(response => resolve(response))
          .catch((error) => {
            reject(error);
          });
      } else {
        resolve();
      }
    });
  }),

  insertVcQuestionAssessmentTrack: thunk((actions, payload, { getState }) => {
    const {
      quizSlug,
      question_slug,
      format_id,
      score,
      submitted_answer,
      time_spent_in_ms,
    } = payload;
    let response = submitted_answer || [];
    const singleAnswerFormatIds = ['scq', 'boolean', 'fib', 'numeric'];
    if (response.length < 2 && (singleAnswerFormatIds.includes(format_id))) {
      response = get(submitted_answer, '0', {});
    }
    const quizzes = getState();
    const trackId = get(quizzes, `${quizSlug}.trackId`);
    const data = {
      question_id: question_slug,
      format_id,
      score,
      time_spent_in_ms,
      response,
      vc_id: vcId,
      teacher_id: teacherId,
      vc_quiz_track_id: trackId,
    };
    return new Promise((resolve, reject) => {
      if (!trackId) {
        return resolve();
      }
      if (vcId && teacherId && isStudent()) {
        insertVcQuestionAssessmentTrack(data)
          .then((data) => {
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          });
      } else if (isStudent()) {
        console.log('vcId -- ', vcId);
        console.log('teacherId -- ', teacherId);
        Sentry.withScope((scope) => {
          scope.setTag('errorType', 'FrontendError');
          scope.setTag('queryName', 'insert_vc_question_assessment_track');
          scope.setLevel('error');
          Sentry.captureException(new Error('Missing vcId or teacherId'));
        });
        reject(new Error('Missing vcId or teacherId'));
      }
    });
  }),
};

export default persist(model);
