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
 * Created: April 21, 2017
 *
 */

import { reset as resetForm, change as changeField } from 'redux-form';
import actions from 'actions';
import { forms } from 'modules/DataCatalog/const';
import { ContainerBuilder, get } from 'services/Utils';
import CreateDataNode from './presenter';
import SelectorsBuilder from './selectors';
import isEmpty from 'lodash/isEmpty';

const selectors = (new SelectorsBuilder()).build();

const NODE_FIELD = 'node';
const ORG_FIELD = 'organization';

export default class FormCreateDataNode extends ContainerBuilder {
  getComponent() {
    return CreateDataNode;
  }

  getFormParams() {
    return {
      form: forms.createDataNode,
      validate: this.fieldValidator,
    };
  }

  fieldValidator({ node, organization, description }) {
    let result = {};
    if (!node) {
      result.node = 'Data node must be defined';
    }
    if (!organization && node === -1) {
      result.organization = 'Organization must be defined';
    }
    if (!description && node === -1) {
      result.description = 'Description must be defined';
    }
    return isEmpty(result) ? undefined : result;
  }

  mapStateToProps(state) {
    const isLoading = get(state, 'dataCatalog.dataNode.isLoading', false);
    const datanodeId = get(state, 'dataCatalog.dataSource.data.result.dataNode.id');

    const formValues = selectors.getValues(state);

    let dataNodeExists = false;
    if (formValues) {
      if (!datanodeId) {
        const selectedNodeId = formValues.node;
        dataNodeExists = parseInt(selectedNodeId || -1, 10) !== -1;
      }
    }
    const dataNodes = selectors.getDataNodeOptions(state);
    const organizations = selectors.getOrganizationOptions(state);

    return {
      NODE_FIELD,
      ORG_FIELD,
      isLoading,
      datanodeId,
      dataNodes,
      organizations,
      dataNodeExists,
    };
  }

  getMapDispatchToProps() {
    return {
      reset: () => resetForm(forms.createDataNode),
      changeField: (field, value) => changeField(forms.createDataNode, field, value),
      update: actions.dataCatalog.dataNode.update,
      loadDataSource: actions.dataCatalog.dataSource.find,
      loadDataNodes: actions.dataCatalog.dataNode.find,
      loadOrganizations: actions.dataCatalog.organization.find,
      selectNewDataNode: actions.dataCatalog.dataNode.selectNewDataNode,
      selectNewOrganization: actions.dataCatalog.organization.selectNewOrganization,
    };
  }

  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      ...stateProps,
      ...dispatchProps,
      async doSubmit(data) {
        const dataNode = await dispatchProps.update({ id: stateProps.datanodeId },
          { name: data.node,
            description: data.description,
            organization: { id: data.organization }
          });
        await dispatchProps.loadDataSource({
          id: ownProps.dataSourceId,
        });

        return dataNode;
      },
      createDataNode({ name }) {
        dispatchProps.selectNewDataNode(name);
        dispatchProps.changeField(NODE_FIELD, -1);
        return new Promise(res => res());
      },
      createOrganization({ name }) {
        dispatchProps.selectNewOrganization(name);
        dispatchProps.changeField(ORG_FIELD, -1);
        return new Promise(res => res());
      },
      loadDataNodes(query) {
        dispatchProps.loadDataNodes({}, { query });
      },
      loadOrganizations(query) {
        dispatchProps.loadOrganizations({}, { query });
      },
      ...ownProps, // allow redefining of the doSubmit method via own props
    };
  }
}
