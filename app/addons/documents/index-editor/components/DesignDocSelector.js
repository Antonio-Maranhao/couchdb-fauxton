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

import React, { Component } from "react";
import ReactDOM from "react-dom";
import FauxtonAPI from "../../../../core/api";
import ReactComponents from "../../../components/react-components";

const StyledSelect = ReactComponents.StyledSelect;

export default class DesignDocSelector extends Component {

  constructor(props) {
    super(props);
  }

  validate() {
    if (this.props.selectedDesignDocName === 'new-doc' && this.props.newDesignDocName === '') {
      FauxtonAPI.addNotification({
        msg: 'Please name your design doc.',
        type: 'error'
      });
      ReactDOM.findDOMNode(this.refs.newDesignDoc).focus();
      return false;
    }
    return true;
  }

  getDocList() {
    return _.map(this.props.designDocList, function (designDoc) {
      return (<option key={designDoc} value={designDoc}>{designDoc}</option>);
    });
  }

  selectDesignDoc(e) {
    this.props.onSelectDesignDoc(e.target.value);
  }

  updateDesignDocName(e) {
    this.props.onChangeNewDesignDocName(e.target.value);
  }

  getNewDDocField() {
    if (this.props.selectedDesignDocName !== 'new-doc') {
      return;
    }
    return (
      <div id="new-ddoc-section" className="span5">
        <label className="control-label" htmlFor="new-ddoc">_design/</label>
        <div className="controls">
          <input type="text" ref="newDesignDoc" id="new-ddoc" placeholder="newDesignDoc"
            onChange={this.updateDesignDocName.bind(this)} />
        </div>
      </div>
    );
  }

  getDocLink() {
    if (!this.props.docLink) {
      return null;
    }
    return (
      <a className="help-link" data-bypass="true" href={this.props.docLink} target="_blank">
        <i className="icon-question-sign" />
      </a>
    );
  }

  render() {
    const selectContent =
      <optgroup label="Select a document">
        <option value="new-doc">New document</option>
        {this.getDocList()}
      </optgroup>;

    return (
      <div className="design-doc-group control-group">
        <div className="span3">
          <label htmlFor="ddoc">{this.props.designDocLabel}
            {this.getDocLink()}
          </label>
          <StyledSelect
            selectChange={this.selectDesignDoc.bind(this)}
            selectValue={this.props.selectedDesignDocName}
            selectId={"faux__edit-view__design-doc"}
            selectContent={selectContent}
          />
        </div>
        {this.getNewDDocField()}
      </div>
    );
  }
}

DesignDocSelector.defaultProps = {
  designDocLabel: 'Design Document'
};

DesignDocSelector.propTypes = {
  designDocList: React.PropTypes.array.isRequired,
  onSelectDesignDoc: React.PropTypes.func.isRequired,
  onChangeNewDesignDocName: React.PropTypes.func.isRequired,
  selectedDesignDocName: React.PropTypes.string.isRequired,
  newDesignDocName: React.PropTypes.string.isRequired,
  designDocLabel: React.PropTypes.string,
  docURL: React.PropTypes.string
};
