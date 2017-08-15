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
import "../../../../../assets/js/plugins/prettify";
import app from "../../../../app";
import FauxtonAPI from "../../../../core/api";
import ReactComponents from "../../../components/react-components";

const PaddedBorderedBox = ReactComponents.PaddedBorderedBox;
const CodeEditorPanel = ReactComponents.CodeEditorPanel;
const ConfirmButton = ReactComponents.ConfirmButton;
const getDocUrl = app.helpers.getDocUrl;

export default class MangoIndexEditor extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    prettyPrint();
  }

  componentDidUpdate () {
    prettyPrint();
  }

  getEditorValue () {
    return this.refs.codeEditor.getValue();
  }

  editorHasErrors () {
    return this.refs.codeEditor.getEditor().hasErrors();
  }

  editor() {
    const editQueryURL = '#' + FauxtonAPI.urls('mango', 'query-app', encodeURIComponent(this.props.databaseName));
    return (
      <div className="mango-editor-wrapper">
        <form className="form-horizontal" onSubmit={(ev) => {this.saveIndex(ev);}}>
          <PaddedBorderedBox>
            <CodeEditorPanel
              id="query-field"
              ref="codeEditor"
              title="Index"
              docLink={getDocUrl('MANGO_INDEX')}
              defaultCode={this.props.queryIndexCode} />
          </PaddedBorderedBox>
          <div className="padded-box">
            <div className="control-group">
              <ConfirmButton text="Create index" id="create-index-btn" showIcon={false} />
              <a className="edit-link" href={editQueryURL}>edit query</a>
            </div>
          </div>
        </form>
      </div>
    );
  }

  render () {
    return this.editor();
  }

  saveIndex (event) {
    event.preventDefault();

    if (this.editorHasErrors()) {
      FauxtonAPI.addNotification({
        msg:  'Please fix the Javascript errors and try again.',
        type: 'error',
        clear: true
      });
      return;
    }

    this.props.saveIndex({
      databaseName: this.props.databaseName,
      indexCode: this.getEditorValue(),
    });
  }
}

MangoIndexEditor.propTypes = {
  databaseName: React.PropTypes.string.isRequired,
  saveIndex: React.PropTypes.func.isRequired,
  queryIndexCode: React.PropTypes.string.isRequired
};
