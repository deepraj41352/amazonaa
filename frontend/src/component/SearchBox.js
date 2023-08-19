import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, FormControl, InputGroup } from 'react-bootstrap';

export default function SearchBox() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const handelSubmit = async (e) => {
    e.preventDefault();
    navigate(query ? `/search/?query=${query}` : '/search');
  };
  return (
    <Form className="de-flex me-auto" onSubmit={handelSubmit}>
      <InputGroup>
        <FormControl
          type="text"
          name="q"
          id="q"
          onChange={(e) => setQuery(e.target.value)}
          placeholder="search products..."
          aria-label="Search Products"
          aria-describedby="button-search"
        ></FormControl>
        <Button variant="outline-primary" type="submit" id="button-search">
          <i className="fas fa-search"></i>
        </Button>
      </InputGroup>
    </Form>
  );
}
