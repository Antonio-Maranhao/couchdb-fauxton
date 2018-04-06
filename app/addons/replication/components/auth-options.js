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
import FauxtonAPI from '../../../core/api';
import React from 'react';
// import Constants from '../constants';
import Components from '../../components/react-components';

const { StyledSelect } = Components;


export class ReplicationAuth extends React.Component {

  constructor (props) {
    super(props);
    this.onChangeType = this.onChangeType.bind(this);
    this.onChangeValue = this.onChangeValue.bind(this);
    // this.custom_auths = [];

    // init auth extensions
    this.customAuths = FauxtonAPI.getExtensions('Replication:Auth');
    if (!this.customAuths) {
      this.customAuths = [];
    }
    this.customAuthTypes = this.customAuths.map(auth => auth.typeValue);
    // return auth_extensions.map((ext) => {
    //   if (ext.typeValue) {
    //     this.custom_auths.pext;
    //   }
    //   // return (<Extension doc={this.props.doc} key={i} />);
    // });
  }

  getAuthOptions = () => {
    const authOptions = [
      { value: 'no_auth', label: 'None' },
      { value: 'basic_auth', label: 'Username and Password' }
    ];
    this.customAuths.map(auth => {
      console.log('>>', auth);
      authOptions.push({ value: auth.typeValue, label: auth.typeLabel });
    });
    authOptions.map(option => console.log(option.value));
    return authOptions.map(option => <option value={option.value} key={option.value}>{option.label}</option>);
  }

  onChangeType(newType) {
    this.props.onChangeAuthType(newType);
    console.log('TODO: show details');
  }

  onChangeValue(newValue) {
    this.props.onChangeAuth(newValue);
  }

  getAuthInputFields(authValue, authType) {
    if (authType == 'basic_auth') {
      return <UserPasswordAuthInput onChange={this.onChangeValue} auth={authValue}/>;
    }
    const matchedAuths = this.customAuths.filter(el => el.typeValue === authType);
    if (matchedAuths && matchedAuths.length > 0) {
      const InputComp = matchedAuths[0].inputComponent;
      return <InputComp onChange={this.onChangeValue} value={authValue} />;
    }

    return null;
  }

  render () {
    let {value, authType, selectId} = this.props;
    if (!value) {
      value = 'no_auth';
    }
    return (<React.Fragment>
      <div className="replication__section">
        <div className="replication__input-label">
          Authentication:
        </div>
        <div className="replication__input-select">
          <StyledSelect
            selectContent={this.getAuthOptions()}
            selectChange={(e) => this.onChangeType(e.target.value)}
            selectId={selectId}
            selectValue={authType} />
        </div>
      </div>
      {this.getAuthInputFields(value, authType)}
    </React.Fragment>);
  }
}

ReplicationAuth.propTypes = {
  selectId: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

export class UserPasswordAuthInput extends React.Component {

  constructor (props) {
    super(props);
    this.updatePassword = this.updatePassword.bind(this);
    this.updateUsername = this.updateUsername.bind(this);
    this.state = {
      username: props.auth ? props.auth.username : '',
      password: props.auth ? props.auth.password : ''
    };
  }

  updatePassword(newValue) {
    this.setState({password: newValue});
    this.props.onChange({
      username: this.state.username,
      password: newValue
    });
  }

  updateUsername(newValue) {
    this.setState({username: newValue});
    this.props.onChange({
      username: newValue,
      password: this.state.password
    });
  }

  render () {
    return (
      <React.Fragment>
        <div className="replication__section">
          <div className="replication__input-label"></div>
          <div>
            <input
              type="text"
              placeholder="Username"
              value={this.state.username}
              onChange={(e) => this.updateUsername(e.target.value)}
            />
          </div>
        </div>
        <div className="replication__section">
          <div className="replication__input-label"></div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={this.state.password}
              onChange={(e) => this.updatePassword(e.target.value)}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

UserPasswordAuthInput.propTypes = {
  auth: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};

