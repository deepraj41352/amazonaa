import React from 'react';
import Spinner from 'react-bootstrap/Spinner';
export default function LoadingBox() {
  return (
    <div>
      <Spinner animation="border" rol="status">
        <span className="visully-hidden"></span>
      </Spinner>
    </div>
  );
}
