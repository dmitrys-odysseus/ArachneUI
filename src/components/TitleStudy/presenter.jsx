/*
 *
 * Copyright 2018 Odysseus Data Services, inc.
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
 * Created: September 15, 2017
 *
 */

import React from 'react';
import BEMHelper from 'services/BemHelper';
import { Link } from 'arachne-ui-components';
import getIcons from './icons';

require('./style.scss');

function TitleStudy(props) {
  const classes = new BEMHelper('title-study');
  const {
    className,
    mods,
    title,
    link = null,
    titleLabel,
    titleLabelDescr,
    showPrivacy = true,
  } = props;

  return (
    <div {...classes({ modifiers: mods, extra: className })}>
      <div {...classes('icon-list')}>
        {getIcons(showPrivacy).map((icoEl, idx) => React.createElement(icoEl, { ...props, key: idx, ...classes('icon') }))}
      </div>
      {link
        ? <Link {...classes('title')} to={link}>{title}</Link>
        : <span {...classes('title')}>{title}</span>
      }
      {titleLabel &&
        <span
          {...classes('label')}
          title={titleLabel}
          alt={titleLabelDescr}
        >
          {titleLabel}
        </span>
      }
    </div>
  );
}

export default TitleStudy;
