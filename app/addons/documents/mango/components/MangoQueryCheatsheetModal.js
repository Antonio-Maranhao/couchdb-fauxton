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
              <th>Condition Operator</th>
              <th>Argument</th>
              <th>Purpose</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                $eq, $ne<br/>
                $lt, $lte<br/>
                $gt, $gte
              </td>
              <td>Any JSON value</td>
              <td>
                Equal, Not equal<br/>
                Lesser, Lesser or equal,<br/>
                Greater, Greater or equal
              </td>
            </tr>
            <tr>
              <td>$exists</td>
              <td>Boolean</td>
              <td>Check field exists or not</td>
            </tr>
            <tr>
              <td>$type</td>
              <td>String</td>
              <td>Check field type, accepts: <pre>{typeOpValidValues}</pre></td>
            </tr>
            <tr>
              <td>$in, $nin</td>
              <td>Array of JSON values</td>
              <td>Field must exist / not exist</td>
            </tr>
            <tr>
              <td>$size</td>
              <td>Integer</td>
              <td>Match length of an array field</td>
            </tr>
            <tr>
              <td>$mod</td>
              <td>[Divisor, Remainder]</td>
              <td>Matches <pre>field % Divisor == Remainder</pre></td>
            </tr>
            <tr>
              <td>$regex</td>
              <td>String</td>
              <td>String value matches a regex</td>
            </tr>
          </tbody>
        </Table>
        <br/>
        <Table striped>
          <thead>
            <tr>
              <th>Combination Operators</th>
              <th>Argument</th>
              <th>Purpose</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>$and</td>
              <td>Array</td>
              <td>Matches if ALL the selectors in the array match</td>
            </tr>
            <tr>
              <td>$or</td>
              <td>Array</td>
              <td>Matches if ANY the selectors in the array match</td>
            </tr>
            <tr>
              <td>$nor</td>
              <td>Array</td>
              <td>Matches if NONE of the selectors in the array match</td>
            </tr>
            <tr>
              <td>$not</td>
              <td>Selector</td>
              <td>Matches if the given selector does not match</td>
            </tr>
            <tr>
              <td>$all</td>
              <td>Array</td>
              <td>Matches an array value if it contains all the elements of the argument array</td>
            </tr>
            <tr>
              <td>$elemMatch</td>
              <td>Selector</td>
              <td>Matches an array field with AT LEAST ONE element that matches ALL the specified query criteria</td>
            </tr>
            <tr>
              <td>$allMatch</td>
              <td>Selector</td>
              <td>Matches an array field with ALL elements matching ALL the specified query criteria</td>
            </tr>
            <tr>
              <td>$keyMapMatch</td>
              <td>Selector</td>
              <td>Matches a map that contains AT LEAST ONE key that matches ALL the specified query criteria</td>
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
