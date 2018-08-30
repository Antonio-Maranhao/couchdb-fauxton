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

import React from "react";
import ReactDOM from "react-dom";


export default class PartitionDbModeSelector extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      global: false,
      partitionName: '',
      selectedPartitionName: '',
      editMode: false
    };
    this.flip = this.flip.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.startEdit = this.startEdit.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  flip(e) {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    this.setState({global: !this.state.global});
  }

  startEdit() {
    this.setState({editMode: true});
  }

  globalHeader() {
    return (
      <div style={{paddingLeft: 6}}>Global view</div>
    );
  }

  onBlur(e) {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    this.setState({editMode: false});
  }

  onKeyPress(e) {
    if (e.key === 'Enter') {
      this.setState({
        editMode: false,
        selectedPartitionName:
        this.state.partitionName
      });
    }
  }

  onChange(e) {
    this.setState({partitionName: e.target.value});
  }

  partitionHeader() {
    if (this.state.editMode) {
      // onKeyPress={this.onKeyPress} onBlur={this.onBlur}
      return (
        <input style={{padding:2, fontSize:16}} type="text" onKeyPress={this.onKeyPress} onChange={this.onChange} onBlur={this.onBlur} value={this.state.partitionName} />
      );
    }
    let partName = 'Click to select a partition';
    if (this.state.selectedPartitionName.trim() !== '') {
      partName = this.state.selectedPartitionName;
    }
    return (
      <div style={{paddingLeft: 6, flex: 1, fontSize:16}} onClick={this.startEdit}>
        {partName}
        {/* <input type="text" onFocus={this.onBlur} onBlur={this.onBlur} value={this.state.partitionName} /> */}
      </div>
    );
  }

  render() {
    const {global} = this.state;
    return (
      <div className="faux-header__doc-header-partition" style={{display: 'flex'}}>
        <a onClick={this.flip} style={{paddingRight: 8}}>
          <svg style={{fill:(global ? "gray" : "#3d70b2")}} width="16" height="12" viewBox="0 0 16 12"><path d="M8.05 2a2.5 2.5 0 0 1 4.9 0H16v1h-3.05a2.5 2.5 0 0 1-4.9 0H0V2h8.05zm2.45 2a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM3.05 9a2.5 2.5 0 0 1 4.9 0H16v1H7.95a2.5 2.5 0 0 1-4.9 0H0V9h3.05zm2.45 2a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"></path></svg>
        </a>

        {global ? this.globalHeader() : this.partitionHeader()}
      </div>
    );
  }
}
