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
import { TabElementWrapper, TabElement } from '../../../components/components/tabelement';
import Components from "../../../components/react-components";
import IndexPanel from "./IndexPanel";

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

  jsonTabContent () {

    return (
      <Accordion className="explain-json">
        <AccordionItem title='JSON response'>
          <pre className="prettyprint">{JSON.stringify(this.props.explainPlan, null, ' ')}</pre>
        </AccordionItem>
      </Accordion>

    );
  }

  parsedTabContent () {
    const {index} = this.props.explainPlan;
    if (!index) {
      return "Invalid explain plan";
    }
    // TODO: remove me
    this.props.explainPlan.index_candidates = [
      {
        "index": {
          "ddoc": null,
          "name": "_all_docs",
          "type": "special",
          "def": {
            "fields": [
              {
                "_id": "asc"
              }
            ]
          }
        },
        "reason": "not_choosen"
      },
      {
        "index": {
          "ddoc": "_design/age",
          "name": "age",
          "type": "json",
          "partitioned": false,
          "def": {
            "fields": [
              {
                "age": "asc"
              }
            ]
          }
        },
        "reason": "insufficient_index_range"
      },
      {
        "index": {
          "ddoc": "_design/favorites",
          "name": "favorites",
          "type": "json",
          "partitioned": false,
          "def": {
            "fields": [
              {
                "favorites": "asc"
              }
            ]
          }
        },
        "reason": "missing_fields"
      },
      {
        "index": {
          "ddoc": "_design/favorites_3",
          "name": "favorites_3",
          "type": "json",
          "partitioned": false,
          "def": {
            "fields": [
              {
                "favorites.3": "asc"
              }
            ]
          }
        },
        "reason": "missing_fields"
      },
      {
        "index": {
          "ddoc": "_design/location",
          "name": "location",
          "type": "json",
          "partitioned": false,
          "def": {
            "fields": [
              {
                "location.state": "asc"
              },
              {
                "location.city": "asc"
              },
              {
                "location.address.street": "asc"
              },
              {
                "location.address.number": "asc"
              }
            ]
          }
        },
        "reason": "missing_fields"
      },
      {
        "index": {
          "ddoc": "_design/manager",
          "name": "manager",
          "type": "json",
          "partitioned": false,
          "def": {
            "fields": [
              {
                "manager": "asc"
              }
            ]
          }
        },
        "reason": "insufficient_index_range"
      },
      {
        "index": {
          "ddoc": "_design/name",
          "name": "name",
          "type": "json",
          "partitioned": false,
          "def": {
            "fields": [
              {
                "name.last": "asc"
              },
              {
                "name.first": "asc"
              }
            ]
          }
        },
        "reason": "missing_fields"
      },
      {
        "index": {
          "ddoc": "_design/ordered",
          "name": "ordered",
          "type": "json",
          "partitioned": false,
          "def": {
            "fields": [
              {
                "ordered": "asc"
              }
            ]
          }
        },
        "reason": "missing_fields"
      },
      {
        "index": {
          "ddoc": "_design/twitter",
          "name": "twitter",
          "type": "json",
          "partitioned": false,
          "def": {
            "fields": [
              {
                "twitter": "asc"
              }
            ]
          }
        },
        "reason": "missing_fields"
      },
      {
        "index": {
          "ddoc": "_design/user_id",
          "name": "user_id",
          "type": "json",
          "partitioned": false,
          "def": {
            "fields": [
              {
                "user_id": "asc"
              }
            ]
          }
        },
        "reason": "missing_fields"
      }
    ];

    // Matching index
    let matchingIndex = null;
    if (index.name === '_all_docs') {
      matchingIndex = <div className='explain-index-panel'>
          No matching index found. Using built-in <code>_all_docs</code> index.
        <br/>
          You can create an index to optimize query time.
      </div>;
    } else {
      matchingIndex = <IndexPanel index={index} />;
    }

    // Candidates
    const {index_candidates} = this.props.explainPlan;
    let candidateIndexes = null;
    if (index_candidates && index_candidates.length > 0) {
      candidateIndexes = index_candidates.map((candidate) => {
        const { index, reason} = candidate;
        return <IndexPanel key={`${index.ddoc}"-"${index.name}`}
          index={index} reason={reason}/>;
      });
    } else {
      candidateIndexes = <div className='explain-index-panel'>
          No candidates index found.
      </div>;
    }

    return (
      <div>
        <h4>Selected Index</h4>
        {matchingIndex}
        <br/>
        <h4>Candidate Indexes</h4>
        {candidateIndexes}
      </div>
    );
  }



  render () {
    // const { tabSection } = this.state;
    // let content = null;
    // if (tabSection === 'json') {
    //   content = this.jsonTabContent();
    // } else if (tabSection === 'parsed') {
    //   content = this.parsedTabContent();
    // }
    return (
      <div id="explain-plan-wrapper">
        {/* {this.getTabs()} */}
        {this.parsedTabContent()}
        {this.jsonTabContent()}
      </div>
    );
  }
}

ExplainPage.propTypes = {
  explainPlan: PropTypes.object.isRequired
};
