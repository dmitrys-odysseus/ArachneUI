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
 * Created: May 23, 2017
 *
 */

import React from 'react';
import BEMHelper from 'services/BemHelper';
import { Modal, Form, FormTextarea } from 'arachne-ui-components';

require('./style.scss');

function ModalRequestUnlock(props) {
  const classes = new BEMHelper('analysis-form-request-unlock');

  const fields = [
    {
      name: 'description',
      InputComponent: {
        component: FormTextarea,
        props: {
          placeholder: 'Reason for unlock',
        },
      },
    },
  ];

  const submitBtn = {
    label: 'Send',
    loadingLabel: 'Sending...',
    mods: ['success', 'rounded'],
  };

  const cancelBtn = {
    label: 'Cancel',
  };

  return (
    <Modal modal={props.modal} title="Request code files unlock">
      <div {...classes()}>
        <Form
          mods="spacing-sm"
          fields={fields}
          submitBtn={submitBtn}
          cancelBtn={cancelBtn}
          onSubmit={props.doSubmit}
          onCancel={props.modal.close}
          {...props}
        />
      </div>
    </Modal>
  );
}

export default ModalRequestUnlock;
