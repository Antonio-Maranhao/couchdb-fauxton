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
import { Modal, Table } from 'react-bootstrap';
import ReactDOM from "react-dom";
import {CodeEditor} from './codeeditor';
import {Beautify} from './beautify';
import {ZenModeOverlay} from './zenmodeoverlay';


// list of JSHINT errors to ignore: gets around problem of anonymous functions not being valid
const ignorableErrors = [
  'Missing name in function declaration.',
  "['{a}'] is better written in dot notation."
];

// const sampleCode = `
// director": {
//   "$eq": "Lars von Trier"
// }`;
const validValues = `"null", "boolean", "number", "string", "array", and "object"`;
function MangoHintsModal({isVisible, onHide}) {
  return <Modal dialogClassName="mango-cheatsheet-modal" show={isVisible}>
    <Modal.Header closeButton={false}>
      <Modal.Title>Query Cheatsheet</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <div className='table-wrapper'>
        <Table striped>
          <thead>
            <tr>
              <th>Operator type</th>
              <th>Operators</th>
              <th>Purpose</th>

            </tr>
          </thead>
          <tbody>
            <tr>
              <td>(In)equality</td>
              <td>
                $eq, $ne<br/>
                $lt, $lte<br/>
                $gt, $gte
              </td>
              <td>
                Equal, Not equal<br/>
                Lesser, Lesser or equal,<br/>
                Greater, Greater or equal
              </td>

            </tr>
            <tr>
              <td>Object</td>
              <td>$exists</td>
              <td>Check field exists or not</td>

            </tr>
            <tr>
              <td>Object</td>
              <td>$type</td>
              <td>Check field type (<pre>{validValues}</pre>)</td>

            </tr>
            <tr>
              <td>Array</td>
              <td>$in, $nin</td>
              <td>Field must exist / not exist</td>

            </tr>
            <tr>
              <td>Array</td>
              <td>$size</td>
              <td>Match length of an array field</td>

            </tr>
            <tr>
              <td>Misc.</td>
              <td>$mod</td>
              <td>Matches <pre>field % Divisor == Remainder</pre></td>

            </tr>
            <tr>
              <td>Misc.</td>
              <td>$regex</td>
              <td>String value matches a regex</td>

            </tr>
          </tbody>
        </Table>
      </div>
    </Modal.Body>
    <Modal.Footer>
      <button onClick={onHide} data-bypass="true" className="btn btn-cf-secondary">Close</button>
    </Modal.Footer>
  </Modal>;
}

/**
 * A pre-packaged JS editor panel for use on the Edit Index / Mango pages. Includes options for a title, zen mode
 * icon and beautify button.
 */
export class CodeEditorPanel extends React.Component {
  static defaultProps = {
    id: 'code-editor',
    className: '',
    defaultCode: '',
    title: '',
    docLink: '',
    allowZenMode: true,
    syntaxMode: 'javascript',
    blur () {}
  };

  getStoreState = () => {
    return {
      zenModeEnabled: false,
      code: this.props.defaultCode,
      showHintsModal: false,
    };
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.defaultCode !== this.props.defaultCode) {
      this.setState({ code: nextProps.defaultCode });
    }
  }

  getZenModeIcon = () => {
    if (this.props.allowZenMode) {
      return <span className="fonticon fonticon-resize-full zen-editor-icon" title="Enter Zen mode" onClick={this.enterZenMode}></span>;
    }
  };

  getHintsIcon = () => {
    return <span className="fonticon fonticon-bookmark cheatsheet-icon" title="Show cheatsheet" onClick={this.showHintsModal}></span>;
  };

  getDocIcon = () => {
    if (this.props.docLink) {
      return (
        <a className="help-link"
          data-bypass="true"
          href={this.props.docLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="fonticon-help-circled"></i>
        </a>
      );
    }
  };

  getZenModeOverlay = () => {
    if (this.state.zenModeEnabled) {
      return (
        <ZenModeOverlay
          defaultCode={this.state.code}
          mode={this.props.mode}
          ignorableErrors={ignorableErrors}
          onExit={this.exitZenMode} />
      );
    }
  };

  enterZenMode = () => {
    this.setState({
      zenModeEnabled: true,
      code: this.codeEditor.getValue()
    });
  };

  exitZenMode = (content) => {
    this.setState({ zenModeEnabled: false });
    this.getEditor().setValue(content);
  };

  getEditor = () => {
    return this.codeEditor;
  };

  getValue = () => {
    return this.getEditor().getValue();
  };

  beautify = (code) => {
    this.setState({ code: code });
    this.getEditor().setValue(code);
  };

  update = () => {
    this.getEditor().setValue(this.state.code);
  };

  state = this.getStoreState();

  hideHintsModal = () => {
    this.setState({showHintsModal: false});
  };

  showHintsModal = () => {
    this.setState({showHintsModal: true});
  };

  render() {
    var classes = '';
    if (this.props.className) {
      classes = this.props.className;
    }
    return (
      <div id="editor-panel-wrapper" className={classes}>
        <MangoHintsModal isVisible={this.state.showHintsModal} onHide={this.hideHintsModal}/>
        <label>
          <span>{this.props.title}</span>
          {this.getDocIcon()}
          {this.getZenModeIcon()}
          {this.getHintsIcon()}
        </label>
        <CodeEditor
          id={this.props.id}
          ref={node => this.codeEditor = node}
          mode={this.props.syntaxMode}
          defaultCode={this.state.code}
          showGutter={true}
          ignorableErrors={ignorableErrors}
          // setHeightToLineCount={true}
          minLines={30}
          blur={this.props.blur}
        />
        <Beautify code={this.state.code} beautifiedCode={this.beautify} />
        {this.getZenModeOverlay()}
      </div>
    );
  }
}
