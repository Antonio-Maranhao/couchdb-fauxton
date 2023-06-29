import React from 'react';
import { Modal, Table } from 'react-bootstrap';

// const typeOpValidValues = `"null", "boolean", "number", "string", "array", and "object"`;

export default function ExplainReasonsLegendModal({isVisible, onHide}) {
  return <Modal dialogClassName="explain-reasons-legend-modal" show={isVisible}>
    <Modal.Header closeButton={false}>
      <Modal.Title>Reasons for Unsuitable Indexes</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <div className='table-wrapper'>
        <Table striped>
          <thead>
            <tr>
              <th>Code</th>
              <th>Explanation</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>alphabetically_comes_after</td>
              <td>When similar indexes exists, one is picked based on the alphabetical order of their names</td>
            </tr>
            <tr>
              <td>field_mismatch</td>
              <td>Index type is not ideal</td>
            </tr>
            <tr>
              <td>less_overlap</td>
              <td>...</td>
            </tr>
            <tr>
              <td>unfavored_type</td>
              <td>Index type is not ideal</td>
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
