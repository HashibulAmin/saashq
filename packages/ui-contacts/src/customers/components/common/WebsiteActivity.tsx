import {
  FieldStyle,
  SidebarCounter,
  SidebarList,
} from '@saashq/ui/src/layout/styles';

import Box from '@saashq/ui/src/components/Box';
import EmptyState from '@saashq/ui/src/components/EmptyState';
import { IUrlVisits } from '../../types';
import React from 'react';
import { __ } from '@saashq/ui/src/utils';
import { calculatePercentage } from '@saashq/ui/src/utils/core';
import styled from 'styled-components';

type Props = {
  urlVisits: IUrlVisits[];
};

const Description = styled.li`
  color: #666 !important;
`;

const Bolder = styled.span`
  font-weight: 500;
`;

const Count = styled.label`
  color: #444;
  margin-right: 7px;
`;

class WebsiteActivity extends React.Component<Props> {
  private totalVisits = 0;

  constructor(props, context) {
    super(props, context);

    props.urlVisits.map((visitPage) => {
      return (this.totalVisits = this.totalVisits + visitPage.count);
    });
  }

  renderContent() {
    const { urlVisits } = this.props;

    if (urlVisits.length === 0) {
      return (
        <EmptyState icon="chart-line" text="Žádná aktivita" size="small" />
      );
    }

    return (
      <SidebarList className="no-link">
        <Description>
          {__('Nejnavštěvovanější stránky na vašem webu')}
        </Description>
        {this.props.urlVisits.map((data, index) => (
          <li key={index}>
            <FieldStyle>
              <Bolder>{data.url}</Bolder>
            </FieldStyle>
            <SidebarCounter>
              <Count>{data.count}</Count>(
              {calculatePercentage(this.totalVisits, data.count)}%)
            </SidebarCounter>
          </li>
        ))}
      </SidebarList>
    );
  }

  render() {
    return (
      <Box title={__('Aktivita na Webu')} name="webActivity">
        {this.renderContent()}
      </Box>
    );
  }
}

export default WebsiteActivity;
