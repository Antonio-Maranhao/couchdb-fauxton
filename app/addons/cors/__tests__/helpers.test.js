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
import testUtils from "../../../../test/mocha/testUtils";
import * as Helpers from "../helpers";
const assert = testUtils.assert;

describe('CORS helper functions', () => {

  it('allows valid domains', () => {
    const urls = [
      'http://something.com',
      'https://a.ca',
      'https://something.com:8000',
      'https://www.some-valid-domain.com:80',
      'http://localhost',
      'https://localhost',
      'http://192.168.1.113',
      'http://192.168.1.113:1337'
    ];

    urls.forEach((url) => {
      assert.isTrue(Helpers.validateCORSDomain(url));
    });
  });

  it('fails on non http/https domains', () => {
    const urls = [
      'whoahnellythisaintright',
      'ftp://site.com',
      'https://',
      'http://'
    ];
    _.each(urls, (url) => {
      assert.isFalse(Helpers.validateCORSDomain(url));
    });
  });

  it('normalizes common cases, like accidentally added subfolders', () => {
    assert.equal('https://foo.com', Helpers.normalizeUrls('https://foo.com/blerg'));
    assert.equal('https://192.168.1.113', Helpers.normalizeUrls('https://192.168.1.113/blerg'));
    assert.equal('https://foo.com:1337', Helpers.normalizeUrls('https://foo.com:1337/blerg'));
    assert.equal('https://foo.com', Helpers.normalizeUrls('https://foo.com'));
  });
});
