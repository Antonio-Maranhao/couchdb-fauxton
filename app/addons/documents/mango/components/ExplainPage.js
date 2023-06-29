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

import PropTypes from 'prop-types';
import React, { Component } from "react";
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import { TabElementWrapper, TabElement } from '../../../components/components/tabelement';
import Components from "../../../components/react-components";
import IndexPanel from "./IndexPanel";
// import sampleIndexCandidates from "./sampleIndexCandidatesNew";

const { Accordion, AccordionItem } = Components;

export default class ExplainPage extends Component {
  componentDidMount () {
    prettyPrint();
  }

  componentDidUpdate () {
    prettyPrint();
  }

  state = {
    tabSection: 'parsed',
  };

  onTabChange = (tabSection) => {
    this.setState({ tabSection });
  };

  getTabs () {
    const { tabSection } = this.state;
    return (
      <TabElementWrapper>
        <TabElement
          key={1}
          selected={tabSection === 'parsed'}
          text={"Parsed"}
          onChange={() => this.onTabChange('parsed')}
        />
        <TabElement
          key={1}
          selected={tabSection === 'json'}
          text={"JSON"}
          onChange={() => this.onTabChange('json')}
        />
      </TabElementWrapper>
    );
  }

  // Sort candidates indexes to show list JSON indexes not chosen first, then unusable
  // JSON indexes, then all others (text, partial, etc)
  sortCandidateIndexes_OldFormat (candidates) {
    const notChosenJsonIndexes = [];
    const notUsableJsonIndexes = [];
    const otherIndexes = [];
    candidates.forEach((c) => {
      if (c.index.type === 'json') {
        if (c.reason && c.reason.includes('not_chosen')) {
          notChosenJsonIndexes.push(c);
        } else {
          notUsableJsonIndexes.push(c);
        }
      } else {
        otherIndexes.push(c);
      }
    });
    notChosenJsonIndexes.sort((a, b) => {
      if (a.score === undefined) {
        return 1;
      }
      if (b.score === undefined) {
        return -1;
      }
      return a.score - b.score;
    });
    return notChosenJsonIndexes.concat(notUsableJsonIndexes).concat(otherIndexes);
  }

  sortCandidatesByRanking(a, b) {
    if (a.ranking === undefined) {
      return 1;
    }
    if (b.ranking === undefined) {
      return -1;
    }
    const diff = a.ranking - b.ranking;
    if (diff === 0) {
      return a.index.name.localeCompare(b.index.name);
    }
    return diff;
  }

  pickUsableIndexes(candidates) {
    return candidates.filter(c => {
      return c.index.type === 'json' && c.usable;
    }).sort(this.sortCandidatesByRanking);
  }

  pickNotUsableIndexes(candidates) {
    return candidates.filter(c => {
      return c.index.type !== 'json' || !c.usable;
    }).sort(this.sortCandidatesByRanking);
  }

  rawJsonResponse () {
    return (
      <Accordion className="explain-json-response">
        <AccordionItem title='JSON response'>
          <pre className="prettyprint">{JSON.stringify(this.props.explainPlan, null, ' ')}</pre>
        </AccordionItem>
      </Accordion>

    );
  }

  parsedContent () {
    const {index} = this.props.explainPlan;
    if (!index) {
      return "Invalid explain plan";
    }
    // TODO: remove me
    // this.props.explainPlan.index_candidates = sampleIndexCandidates;

    // Matching index
    let matchingIndex = null;
    if (index.name === '_all_docs') {
      matchingIndex = <div className='explain-index-panel'>
          No matching index found. Using built-in <code>_all_docs</code> index.
        <br/>
          You can create an index to optimize query time.
      </div>;
    } else {
      matchingIndex = <IndexPanel index={index} isWinner={true}/>;
    }

    // Candidates
    const {index_candidates} = this.props.explainPlan;
    let usableIndexPanelList = null;
    let notUsableIndexPanelList = null;
    if (index_candidates && index_candidates.length > 0) {
      const sortedCandidates = this.pickUsableIndexes(index_candidates);
      usableIndexPanelList = sortedCandidates.map((candidate) => {
        const { index, reason, ranking, covering } = candidate;
        return <IndexPanel key={`${index.ddoc}"-"${index.name}`} isWinner={false}
          index={index} reason={reason} ranking={ranking} covering={covering === "true"}/>;
      });

      const sortedNotUsable = this.pickNotUsableIndexes(index_candidates);
      notUsableIndexPanelList = sortedNotUsable.map((candidate) => {
        const { index, reason, ranking, covering } = candidate;
        return <IndexPanel key={`${index.ddoc}"-"${index.name}`} isWinner={false}
          index={index} reason={reason} ranking={ranking} covering={covering === "true"}/>;
      });
    }
    if (!usableIndexPanelList) {
      usableIndexPanelList = <div className='explain-index-panel'>
          No usable indexes found.
      </div>;
    }
    if (!notUsableIndexPanelList) {
      notUsableIndexPanelList = <div className='explain-index-panel'>
          No other indexes found.
      </div>;
    }

    return (
      <>
        <span className="explain-plan-section-title">
          Selected Index<InfoIcon tooltip_content={"The index used when running the query"}/>
        </span>
        {matchingIndex}
        <br/>
        <span className="explain-plan-section-title">
          Usable Indexes<InfoIcon tooltip_content={"Other suitable indexes that were not chosen"}/>
        </span>
        {usableIndexPanelList}
        <br/>
        <span className="explain-plan-section-title">
          Not Usable Indexes<InfoIcon tooltip_content={"Indexes that do not match the given query"}/>
        </span>
        {notUsableIndexPanelList}
      </>
    );
  }

  render () {
    return (
      <div id="explain-plan-wrapper">
        {this.parsedContent()}
        {this.rawJsonResponse()}
      </div>
    );
  }
}

ExplainPage.propTypes = {
  explainPlan: PropTypes.object.isRequired
};

const InfoIcon = ({tooltip_content}) => {
  const tooltip = <Tooltip id="graveyard-tooltip">{tooltip_content}</Tooltip>;
  return (
    <OverlayTrigger placement="top" overlay={tooltip}>
      <i className="fonticon fonticon-info-circled"></i>
    </OverlayTrigger>
  );
};
