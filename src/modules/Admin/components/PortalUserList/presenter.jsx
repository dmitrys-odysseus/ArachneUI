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
 * Created: September 29, 2017
 *
 */

import React from 'react';
import BEMHelper from 'services/BemHelper';
import PageWrapper from 'modules/Admin/components/PageWrapper';
import Table from './Table';
import ModalAddUser from './ModalAddUser';
import {
  LoadingPanel,
  PageContent,
} from 'arachne-ui-components';
import Grid from 'components/Grid';
import AdminPagesSelector from 'modules/Admin/components/PageWrapper/Toolbar/AdminPagesSelector';
import PortalUserListActions from './Actions';

require('./style.scss');

function UserList(props) {
  const { isLoading, paginationDetails, filterFields } = props;
  return (
    <PageWrapper>
      <Grid
        isLoading={isLoading}
        title="Settings | Users"
        paginationDetails={paginationDetails}
        filterFields={filterFields}
        Actions={<PortalUserListActions />}
      >
        <Table/>
      </Grid>
      <ModalAddUser/>
    </PageWrapper>
  );
}

export default UserList;
