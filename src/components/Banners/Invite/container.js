/*
 *
 * Copyright 2017 Observational Health Data Sciences and Informatics
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Company: Odysseus Data Services, Inc.
 * Product Owner/Architecture: Gregory Klebanov
 * Authors: Pavel Grafkin, Alexander Saltykov, Vitaly Koulakov, Anton Gackovka, Alexandr Ryabokon, Mikhail Mironov
 * Created: July 13, 2017
 *
 */

import React, { Component } from 'react';
import actions from 'actions';
import { ContainerBuilder, get } from 'services/Utils';
import { goBack } from 'react-router-redux';
import { modules } from 'const/banner';
import SelectorsBuilder from './selectors';
import presenter from './presenter';

const selectors = (new SelectorsBuilder()).build();

class InviteBanner extends Component {
  componentWillMount() {
    if (this.props.studyId !== -1) {
      // in case of studyManager module, to prevent double request for study
      this.props.loadSudyInvitations({ studyId: this.props.studyId });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.studyId !== nextProps.studyId && nextProps.studyId !== -1) {
      if (nextProps.module !== modules.study) {
        nextProps.loadStudy(nextProps.studyId);
      }
      nextProps.loadSudyInvitations({ studyId: nextProps.studyId });
    }
  }

  render() {
    return presenter(this.props);
  }
}

export default class InviteBannerBuilder extends ContainerBuilder {
  getComponent() {
    return InviteBanner;
  }

  mapStateToProps(state) {
    const moduleState = get(state, 'studyManager');
    const studyData = get(moduleState, 'study.data.result', null);

    return {
      accessGranted: studyData !== null,
      invitation: selectors.getInvitation(state),
    };
  }

  getMapDispatchToProps() {
    return {
      goBack,
      loadSudyInvitations: actions.studyManager.studyInvitations.query,
      acceptInvitation: actions.portal.invitation.acceptInvitation,
      rejectInvitation: actions.portal.invitation.rejectInvitation,
      loadStudy: actions.studyManager.study.find,
      loadAnalysis: actions.analysisExecution.analysis.find,
      loadInsight: actions.analysisExecution.insight.find,
    };
  }

  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      ...ownProps,
      ...stateProps,
      ...dispatchProps,
      onAccept: () => {
        // TODO use ownProps
        dispatchProps.acceptInvitation({
          id: stateProps.invitation.id,
          type: stateProps.invitation.type,
        })
        .then(() => {
          switch (ownProps.module) {
            case modules.study:
              return dispatchProps.loadStudy(ownProps.studyId);
            case modules.analysis:
              return dispatchProps.loadAnalysis({ id: ownProps.id });
            case modules.insight:
              return dispatchProps.loadInsight({ submissionId: ownProps.id });
          }
        })
        .then(() => dispatchProps.loadSudyInvitations({ studyId: ownProps.studyId }));
      },
      onDecline: ({ reason }) => {
        return dispatchProps.rejectInvitation({
          id: stateProps.invitation.id,
          type: stateProps.invitation.type,
          comment: reason,
        })
        .then(() => dispatchProps.loadStudy(ownProps.studyId))
        .catch(() => {});
      },
    };
  }

}
