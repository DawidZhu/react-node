import React from 'react';

import Modal from './Modal';
import Button from '../FormElements/Button';
// ErrorModal 组件
const ErrorModal = props => {
  return (
    <Modal
      onCancel={props.onClear}
      header="An Error Occurred! David"
      show={!!props.error}
      footer={<Button onClick={props.onClear}>Ok！Close</Button>}
    >
      <p>{props.error}</p>
    </Modal>
  );
};

export default ErrorModal;
