/**
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
 * Created: February 03, 2017
 *
 */

import { connect } from 'react-redux';
import get from 'lodash/get';
import { paths } from 'modules/DataCatalog/const';
import Toolbar from './presenter';

function mapStateToProps(state) {
  const dataSourceData = get(state, 'dataCatalog.dataSource.data.result');

  return {
    backUrl: paths.dataCatalog(),
    name: `${get(dataSourceData, 'dataNode.name', '')}: ${get(dataSourceData, 'name')}`,
    healthStatus: {
      title: get(dataSourceData, 'healthStatusTitle'),
      value: get(dataSourceData, 'healthStatus'),
    },
    isDeleted: !!get(dataSourceData, 'deleted', ''),
  };
}

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);
