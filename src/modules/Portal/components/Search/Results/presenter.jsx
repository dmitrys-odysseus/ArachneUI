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
 * Created: january 22, 2018
 *
 */

import React from 'react';
import BEMHelper from 'services/BemHelper';
import {
  PageContent,
  Toolbar,
} from 'arachne-ui-components';
import Grid from 'components/Grid';
import cloneDeep from 'lodash/cloneDeep';
import List from './List';
import { Domain } from './List/presenter';

import './style.scss';

export default function SearchResults(props) {
  const classes = BEMHelper('search-result');
  const {
    query,
    isLoading,
    paginationDetails,
    searchQueryDecode,
    searchQueryEncode,
    filterFields = [],
  } = props;

  const filter = cloneDeep(filterFields);
  filter[0].options = filter[0].options.map((field) => ({
    label: <Domain forFilter label={field.label} value={field.value} />,
    value: field.value,
  }));

  return (
    <PageContent {...classes()}>
      <Grid
        {...classes()}
        isLoading={isLoading}
        title={`Global search for '${query}'`}
        filterFields={filter}
        paginationDetails={paginationDetails}
        searchQueryDecode={searchQueryDecode}
        searchQueryEncode={searchQueryEncode}
      >
        <List />
      </Grid>
    </PageContent>
  );
}
