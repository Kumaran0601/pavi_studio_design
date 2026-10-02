import React from 'react';
import { Link } from 'react-router-dom';
import { CircleAlert } from 'lucide-react';

export function PageError({ message }) {
  return (
    <div className="page-error">
      <CircleAlert />
      <h1>Something needs attention.</h1>
      <p>{message}</p>
      <Link className="button button-primary" to="/">
        Return home
      </Link>
    </div>
  );
}
