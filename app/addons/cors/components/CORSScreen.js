import React, { Component } from "react";
import app from "../../../app";
import ReactComponents from "../../components/react-components";
import FauxtonComponents from "../../fauxton/components";
import Origins from "./Origins";
import OriginInput from "./OriginInput";
import OriginTable from "./OriginTable";

const LoadLines = ReactComponents.LoadLines;
const ConfirmationModal = FauxtonComponents.ConfirmationModal;

export default class CORSScreen extends Component {

  constructor (props) {
    super(props);
  }

  componentDidMount() {
    // const { dispatch, url } = this.props;
    this.props.fetchAndLoadCORSOptions();
  }

  enableCorsChange () {
    console.log("CORSScreen.enableCorsChange:", this.props.corsEnabled, 'to', !this.props.corsEnabled);
    if (this.props.corsEnabled && !_.isEmpty(this.props.origins)) {
      var result = window.confirm(app.i18n.en_US['cors-disable-cors-prompt']);
      if (!result) { return; }
    }
    this.props.saveCORS({
        corsEnabled: !this.props.corsEnabled,
        origins: this.props.origins,
        node: this.props.node
        });
  }

  save () {
      console.log("Actions.saveCors");
      this.props.saveCORS({
        corsEnabled: this.props.corsEnabled,
        origins: this.props.origins,
        node: this.props.node
        });
  }

  originChange (isAllOrigins) {
    if (isAllOrigins && !_.isEmpty(this.props.origins)) {
      var result = window.confirm('Are you sure? Switching to all origin domains will overwrite your specific origin domains.');
      if (!result) { return; }
    }
    this.props.saveCORS({
        corsEnabled: this.props.corsEnabled,
        origins: isAllOrigins ? ['*'] : [],
        node: this.props.node
        });
    console.log("Actions.originChange(isAllOrigins);");
  }

  addOrigin (origin) {
      this.props.saveCORS({
        corsEnabled: this.props.corsEnabled,
        origins: this.props.origins.concat(origin),
        node: this.props.node
        });
    console.log("Actions.addOrigin(origin);", origin);
  }

  updateOrigin (updatedOrigin, originalOrigin) {
      const newOrigins = this.props.origins.slice();
      const index = _.indexOf(newOrigins, originalOrigin);
      if (index === -1) { return; }
      newOrigins[index] = updatedOrigin;

    this.props.saveCORS({
        corsEnabled: this.props.corsEnabled,
        origins: newOrigins,
        node: this.props.node
        });
    console.log("Actions.updateOrigin(updatedOrigin, originalOrigin);", updatedOrigin, originalOrigin);
  }

  deleteOrigin () {
      console.log("CORSScreen deleteOrigin");
      const index = _.indexOf(this.props.origins, this.props.domainToDelete);
      if (index === -1) { return; }
    const newOrigins = [
        ...this.props.origins.slice(0, index),
        ...this.props.origins.slice(index + 1)
    ];
      this.props.saveCORS({
        corsEnabled: this.props.corsEnabled,
        origins: newOrigins,
        node: this.props.node
        });
      //newOrigins[index] = updatedOrigin;
    console.log("Actions.deleteOrigin(this.props.domainToDelete);");
  }

  render () {
    var isVisible = _.all([this.props.corsEnabled, !this.props.isAllOrigins]);

    var originSettings = (
      <div id={this.props.corsEnabled ? 'collapsing-container' : ''}>
        <Origins corsEnabled={this.props.corsEnabled} originChange={ this.originChange.bind(this) } isAllOrigins={this.props.isAllOrigins}/>
        <OriginTable updateOrigin={ this.updateOrigin.bind(this) } deleteOrigin={ this.props.showDeleteDomainConfirmation }
            isVisible={isVisible} origins={this.props.origins} />
        <OriginInput addOrigin={ this.addOrigin.bind(this) } isVisible={isVisible} />
      </div>
    );

    if (this.props.isLoading) {
      originSettings = (<LoadLines />);
    }
    var deleteMsg = <span>Are you sure you want to delete <code>{_.escape(this.props.domainToDelete)}</code>?</span>;

    return (
      <div className="cors-page flex-body">
        <header id="cors-header">
          <p>{app.i18n.en_US['cors-notice']}</p>
        </header>

        <form id="corsForm" onSubmit={ this.save.bind(this) }>
          <div className="cors-enable">
            {this.props.corsEnabled ? 'CORS is currently enabled.' : 'CORS is currently disabled.'}
            <br />
            <button
              type="button"
              className="enable-disable btn btn-secondary"
              onClick={ this.enableCorsChange.bind(this) }
              disabled={this.props.isLoading ? 'disabled' : null}
            >
              {this.props.corsEnabled ? 'Disable CORS' : 'Enable CORS'}
            </button>
          </div>
          {originSettings}
        </form>

        <ConfirmationModal
          title="Confirm Deletion"
          visible={this.props.deleteDomainModalVisible}
          text={deleteMsg}
          buttonClass="btn-danger"
          onClose={this.props.hideDeleteDomainConfirmation}
          onSubmit={ this.deleteOrigin.bind(this) }
          successButtonLabel="Delete Domain" />
      </div>
    );
  }


}
