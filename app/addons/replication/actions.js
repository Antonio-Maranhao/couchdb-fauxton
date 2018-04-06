// Licensed under the Apache License, Version 2.0 (the "License"); you may not
// use this file except in compliance with the License. You may obtain a copy of
// the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations under
// the License.
import base64 from 'base-64';
import FauxtonAPI from '../../core/api';
import {get, post} from '../../core/ajax';
import ActionTypes from './actiontypes';
import Helpers from './helpers';
import Constants from './constants';
import {
  supportNewApi,
  createReplicationDoc,
  fetchReplicateInfo,
  fetchReplicationDocs,
  decodeFullUrl,
  deleteReplicatesApi,
  createReplicatorDB
} from './api';


export const initReplicator = (routeLocalSource, localSource) => dispatch => {
  if (routeLocalSource && routeLocalSource !== localSource) {
    dispatch({
      type: ActionTypes.INIT_REPLICATION,
      options: {
        localSource: routeLocalSource
      }
    });
  }
};

export const getDatabasesList = () => dispatch => {
  get('/_all_dbs')
    .then((databases) => {
      dispatch({
        type: ActionTypes.REPLICATION_DATABASES_LOADED,
        options: {
          databases
        }
      });
    });
};

export const replicate = (params) => dispatch => {
  const replicationDoc = createReplicationDoc(params);

  const promise = post('/_replicator', replicationDoc);

  const source = Helpers.getDatabaseLabel(replicationDoc.source);
  const target = Helpers.getDatabaseLabel(replicationDoc.target);

  dispatch({
    type: ActionTypes.REPLICATION_STARTING,
  });

  const handleError = (json) => {
    FauxtonAPI.addNotification({
      msg: json.reason,
      type: 'error',
      clear: true
    });
  };

  promise
    .then(json => {
      if (!json.ok) {
        throw json;
      }

      FauxtonAPI.addNotification({
        msg: `Replication from <code>${decodeURIComponent(source)}</code> to <code>${decodeURIComponent(target)}</code> has been scheduled.`,
        type: 'success',
        escape: false,
        clear: true
      });

      dispatch(getReplicationActivity());
    })
    .catch(json => {
      if (json.error && json.error === "not_found") {
        return createReplicatorDB().then(() => {
          return replicate(params);
        })
          .catch(handleError);
      }

      handleError(json);
    });
};

export const updateFormField = (fieldName, value) => {
  return {
    type: ActionTypes.REPLICATION_UPDATE_FORM_FIELD,
    options: {
      fieldName: fieldName,
      value: value
    }
  };
};

export const clearReplicationForm = () => {
  return { type: ActionTypes.REPLICATION_CLEAR_FORM };
};

export const getReplicationActivity = () => dispatch => {
  dispatch({
    type: ActionTypes.REPLICATION_FETCHING_STATUS,
  });

  supportNewApi()
    .then(supportNewApi => {
      return fetchReplicationDocs(supportNewApi);
    })
    .then(docs => {
      dispatch({
        type: ActionTypes.REPLICATION_STATUS,
        options: docs
      });
    });
};

export const getReplicateActivity = () => dispatch => {
  supportNewApi()
    .then(newApi => {
      if (!newApi) {
        return;
      }

      dispatch({
        type: ActionTypes.REPLICATION_FETCHING_REPLICATE_STATUS,
      });

      fetchReplicateInfo()
        .then(replicateInfo => {
          dispatch({
            type: ActionTypes.REPLICATION_REPLICATE_STATUS,
            options: replicateInfo
          });
        });
    });
};

export const filterDocs = (filter) => {
  return {
    type: ActionTypes.REPLICATION_FILTER_DOCS,
    options: filter
  };
};

export const filterReplicate = (filter) => {
  return {
    type: ActionTypes.REPLICATION_FILTER_REPLICATE,
    options: filter
  };
};

export const selectAllDocs = () => {
  return {
    type: ActionTypes.REPLICATION_TOGGLE_ALL_DOCS
  };
};

export const selectDoc = (id) => {
  return {
    type: ActionTypes.REPLICATION_TOGGLE_DOC,
    options: id
  };
};

export const selectAllReplicates = () => {
  return {
    type: ActionTypes.REPLICATION_TOGGLE_ALL_REPLICATE
  };
};

export const selectReplicate = (id) => {
  return {
    type: ActionTypes.REPLICATION_TOGGLE_REPLICATE,
    options: id
  };
};

export const clearSelectedDocs = () => {
  return {
    type: ActionTypes.REPLICATION_CLEAR_SELECTED_DOCS
  };
};

export const clearSelectedReplicates = () => {
  return {
    type: ActionTypes.REPLICATION_CLEAR_SELECTED_REPLICATES
  };
};

export const deleteDocs = (docs) => dispatch => {
  const bulkDocs = docs.map(({raw: doc}) => {
    doc._deleted = true;
    return doc;
  });

  FauxtonAPI.addNotification({
    msg: `Deleting doc${bulkDocs.length > 1 ? 's' : ''}.`,
    type: 'success',
    escape: false,
    clear: true
  });

  post('/_replicator/_bulk_docs', {docs: bulkDocs}, {raw: true})
    .then(resp => {
      if (!resp.ok) {
        throw resp;
      }
      return resp;
    })
    .then(() => {

      let msg = 'The selected documents have been deleted.';
      if (docs.length === 1) {
        msg = `Document <code>${docs[0]._id}</code> has been deleted`;
      }

      FauxtonAPI.addNotification({
        msg: msg,
        type: 'success',
        escape: false,
        clear: true
      });

      dispatch(clearSelectedDocs());
      dispatch(getReplicationActivity());
    })
    .catch(resp => {
      resp.json()
        .then(error => {
          FauxtonAPI.addNotification({
            msg: error.reason,
            type: 'error',
            clear: true
          });
        });

    });
};

export const deleteReplicates = (replicates) => dispatch => {
  FauxtonAPI.addNotification({
    msg: `Deleting _replicate${replicates.length > 1 ? 's' : ''}.`,
    type: 'success',
    escape: false,
    clear: true
  });

  deleteReplicatesApi(replicates)
    .then(() => {
      let msg = 'The selected replications have been deleted.';
      if (replicates.length === 1) {
        msg = `Replication <code>${replicates[0]._id}</code> has been deleted`;
      }

      dispatch(clearSelectedReplicates());
      dispatch(getReplicateActivity());

      FauxtonAPI.addNotification({
        msg: msg,
        type: 'success',
        escape: false,
        clear: true
      });
    }, (xhr) => {
      const errorMessage = JSON.parse(xhr.responseText);
      FauxtonAPI.addNotification({
        msg: errorMessage.reason,
        type: 'error',
        clear: true
      });
    });
};

const getAuthTypeAndCredentials = (source) => {
  const authTypeAndCreds = {
    type: 'no_auth',
    creds: {}
  };
  if (source.headers && source.headers.Authorization) {
    // Removes 'Basic ' prefix
    const encodedCreds = source.headers.Authorization.substring(6);
    const decodedCreds = base64.decode(encodedCreds);
    authTypeAndCreds.type = 'basic_auth';
    authTypeAndCreds.creds = {
      username: decodedCreds.split(':')[0],
      password: decodedCreds.split(':')[1]
    };
    return authTypeAndCreds;
  }

  // Tries to get creds using one of the custom auth methods
  const customAuths = FauxtonAPI.getExtensions('Replication:Auth');
  let credentials = undefined;
  let customAuthType = undefined;
  if (customAuths) {
    customAuths.map(auth => {
      if (!credentials && auth.getCredentials) {
        credentials = auth.getCredentials(source);
        customAuthType = auth.authType;
      }
    });
  }
  if (credentials) {
    authTypeAndCreds.type = customAuthType;
    authTypeAndCreds.creds = credentials;
  }
  return authTypeAndCreds;
};

export const getReplicationStateFrom = (id) => dispatch => {
  dispatch({
    type: ActionTypes.REPLICATION_FETCHING_FORM_STATE
  });

  get(`/_replicator/${encodeURIComponent(id)}`)
    .then((doc) => {
      const stateDoc = {
        replicationDocName: doc._id,
        replicationType: doc.continuous ? Constants.REPLICATION_TYPE.CONTINUOUS : Constants.REPLICATION_TYPE.ONE_TIME,
      };

      const sourceUrl = _.isObject(doc.source) ? doc.source.url : doc.source;
      const targetUrl = _.isObject(doc.target) ? doc.target.url : doc.target;

      if (sourceUrl.indexOf(window.location.hostname) > -1) {
        const url = new URL(sourceUrl);
        stateDoc.replicationSource = Constants.REPLICATION_SOURCE.LOCAL;
        stateDoc.localSource = decodeURIComponent(url.pathname.slice(1));
      } else {
        stateDoc.replicationSource = Constants.REPLICATION_SOURCE.REMOTE;
        stateDoc.remoteSource = decodeFullUrl(sourceUrl);
      }
      const sourceAuth = getAuthTypeAndCredentials(doc.source);
      stateDoc.sourceAuthType = sourceAuth.type;
      stateDoc.sourceAuth = sourceAuth.creds;

      if (targetUrl.indexOf(window.location.hostname) > -1) {
        const url = new URL(targetUrl);
        stateDoc.replicationTarget = Constants.REPLICATION_TARGET.EXISTING_LOCAL_DATABASE;
        stateDoc.localTarget = decodeURIComponent(url.pathname.slice(1));
      } else {
        stateDoc.replicationTarget = Constants.REPLICATION_TARGET.EXISTING_REMOTE_DATABASE;
        stateDoc.remoteTarget = decodeFullUrl(targetUrl);
      }
      const targetAuth = getAuthTypeAndCredentials(doc.target);
      stateDoc.targetAuthType = targetAuth.type;
      stateDoc.targetAuth = targetAuth.creds;

      dispatch({
        type: ActionTypes.REPLICATION_SET_STATE_FROM_DOC,
        options: stateDoc
      });

    })
    .catch(error => {
      FauxtonAPI.addNotification({
        msg: error.reason,
        type: 'error',
        clear: true
      });
    });
};

export const showConflictModal = () => {
  return {
    type: ActionTypes.REPLICATION_SHOW_CONFLICT_MODAL
  };
};

export const hideConflictModal = () => {
  return {
    type: ActionTypes.REPLICATION_HIDE_CONFLICT_MODAL
  };
};

export const changeActivitySort = (sort) => {
  return {
    type: ActionTypes.REPLICATION_CHANGE_ACTIVITY_SORT,
    options: sort
  };
};

export const checkForNewApi = () => dispatch => {
  supportNewApi().then(newApi => {
    dispatch({
      type: ActionTypes.REPLICATION_SUPPORT_NEW_API,
      options: newApi
    });
  });
};

export const showPasswordModal = () => {
  return {
    type: ActionTypes.REPLICATION_SHOW_PASSWORD_MODAL
  };
};

export const hidePasswordModal = () => {
  return {
    type: ActionTypes.REPLICATION_HIDE_PASSWORD_MODAL
  };
};
