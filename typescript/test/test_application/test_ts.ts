// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import * as util from 'util';
import * as child_process from 'child_process';
import * as fs from 'fs-extra';
import * as path from 'path';
const exec = util.promisify(child_process.exec);
const SHOWCASE_LIB = path.join(
  __dirname,
  '..',
  '..',
  '..',
  '.test-out-showcase'
);
const PACKED_LIB = 'showcase-0.1.0.tgz';
const PACKED_LIB_PATH = path.join(SHOWCASE_LIB, PACKED_LIB);
const PROTOS = path.join(
  __dirname,
  '..',
  '..',
  '..',
  'typescript',
  'test',
  'protos'
);
const LOCAL_TS_APPLICATION = path.join(
  __dirname,
  '..',
  '..',
  '..',
  '.test-application-ts'
);
const TS_TEST_APPLICATION = path.join(
  __dirname,
  '..',
  '..',
  '..',
  'typescript',
  'test',
  'test_application_ts'
);
describe('TestApplication', () => {
  describe('Test application for ts users', () => {
    it('npm install showcase', async function() {
      this.timeout(30000);
      // copy protos to generated client library and copy test application to local.
      if (!fs.existsSync(path.join(SHOWCASE_LIB, 'protos'))) {
        fs.copySync(PROTOS, path.join(SHOWCASE_LIB, 'protos'));
      }
      if (!fs.existsSync(LOCAL_TS_APPLICATION)) {
        fs.copySync(TS_TEST_APPLICATION, LOCAL_TS_APPLICATION);
      }
      process.chdir(SHOWCASE_LIB);
      await exec(`npm install`);
    });
    it('npm pack showcase library and copy it to test application', async function() {
      this.timeout(60000);
      await exec(`npm pack`);
      process.chdir(LOCAL_TS_APPLICATION);
      fs.copySync(PACKED_LIB_PATH, path.join(LOCAL_TS_APPLICATION, PACKED_LIB));
    });
    it('npm install showcase library in test application', async function() {
      this.timeout(60000);
      await exec(`npm install`);
    });
    it('run integration in test application', async function() {
      this.timeout(120000);
      await exec(`npm test`);
    });
    it('run browser test in application', async function() {
      this.timeout(120000);
      await exec(`npm run browser-test`);
    });
  });
});