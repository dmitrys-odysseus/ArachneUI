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
 * Created: June 13, 2017
 *
 */

import { PropTypes } from 'react';
import { get, ContainerBuilder } from 'services/Utils';
import actions from 'actions/index';
import { buildBreadcrumbList } from 'modules/AnalysisExecution/utils';
import ReportUtils from 'components/Reports/Utils';
import { reports } from 'const/reports';
import { LinkBuilder } from 'modules/AnalysisExecution/ducks/linkBuilder';
import FileTreeUtils from 'services/FileTreeUtils';
import { FileLoader } from 'services/FileLoader';
import presenter from './presenter';

export class SubmissionCode extends FileLoader {
  constructor() {
    super();
    this.LinkBuilder = new LinkBuilder();
  }

  componentWillMount() {
    super.componentWillMount();
    this.props.loadBreadcrumbs({
      entityType: this.props.from,
      id: this.props.submissionGroupId || this.props.submissionId,
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.params.fileUuid !== nextProps.params.fileUuid) {
      this.loadData();
    }
  }

  componentWillUnmount() {
    this.props.flushFileTree();
    this.props.clearFileData();
    this.props.clearDetailsData();
  }

  loadTree(props) {
    let folderPath;
    if (props.file && props.file.relativePath) {
      folderPath = FileTreeUtils.getFileFolder(props.file.relativePath);
    } else {
      folderPath = FileTreeUtils.PATH_SEPARATOR;
    }
    props.toggleFolder({ relativePath: folderPath }, true, true);
    props.selectFileInTree({
      relativePath: props.file && props.file.relativePath
        ? props.file.relativePath
        : '',
    });
  }

  render() {
    return presenter({
      ...this.props,
      downloadLink: this.LinkBuilder.build(),
    });
  }
}

export class SubmissionCodeBuilder extends ContainerBuilder {
  constructor() {
    super();
    this.selectors = {};
  }

  getComponent() {
    return SubmissionCode;
  }

  mapStateToProps(state, ownProps) {
    const from = ownProps.route.from;
    const type = ownProps.route.type;
    const submissionGroupId = ownProps.params.submissionGroupId;
    const submissionId = ownProps.params.submissionId;
    const fileUuid = ownProps.params.fileUuid;

    const isFileLoading = this.selectors.getIsFileLoading(state);
    const isLoading = get(state, 'analysisExecution.breadcrumbs.isLoading', false)
      || isFileLoading;

    const pageTitle = [
      this.selectors.getPageTitle(state),
      ...(get(state, 'analysisExecution.breadcrumbs.data', []).map(crumb => crumb.title).reverse()),
      'Arachne',
    ];

    const submissionFileData = this.selectors.getFileData(state);

    const urlParams = {
      type,
      submissionGroupId,
      submissionId,
      fileId: fileUuid,
    };

    const breadcrumbList = buildBreadcrumbList(get(state, 'analysisExecution.breadcrumbs.queryResult.result'));
    const backUrl = breadcrumbList.length > 0 ? breadcrumbList[breadcrumbList.length - 1].link : null;
    const analysis = this.selectors.getAnalysis(state);

    const toolbarOpts = {
      backUrl,
      breadcrumbList,
      caption: get(analysis, 'title'),
    };

    let isReport = false;
    if (submissionFileData && submissionFileData.content) {
      const reportType = ReportUtils.getReportType(get(submissionFileData, 'docType'));
      isReport = reportType !== reports.unknown;
    }

    return {
      urlParams,
      file: submissionFileData,
      isLoading,
      toolbarOpts,
      pageTitle: pageTitle.join(' | '),
      from,
      submissionGroupId,
      submissionId,
      isReport,
      selectedFilePath: this.selectors.getSelectedFileFromTree(state),
    };
  }

  getMapDispatchToProps() {
    return {
      loadBreadcrumbs: actions.analysisExecution.breadcrumbs.query,
      clearDetailsData: actions.analysisExecution.submissionFileDetails.clear,

      loadFilesTree: actions.analysisExecution.fileTreeData.query,
      toggleFileTreeNode: actions.analysisExecution.fileTreeData.toggle,
      selectFileInTree: actions.analysisExecution.fileTreeData.selectFile,
      flushFileTree: actions.analysisExecution.fileTreeData.flush,
      goToPage: actions.router.goToPage,
    };
  }
}

SubmissionCode.propTypes = {
  loadSubmissionFile: PropTypes.func,
  submissionGroupId: PropTypes.number,
  submissionId: PropTypes.string,
  from: PropTypes.string,
  loadBreadcrumbs: PropTypes.func,
  fileUuid: PropTypes.string,
  type: PropTypes.string,
};
