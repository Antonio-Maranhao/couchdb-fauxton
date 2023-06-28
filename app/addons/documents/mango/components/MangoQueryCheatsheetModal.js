import React from 'react';
import { Modal, Table } from 'react-bootstrap';

const typeOpValidValues = `"null", "boolean", "number", "string", "array", and "object"`;

export default function MangoQueryCheatsheetModal({isVisible, onHide}) {
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
              <td>Check field type (<pre>{typeOpValidValues}</pre>)</td>

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
