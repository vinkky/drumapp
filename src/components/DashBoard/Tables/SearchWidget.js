import React, { Component } from "react";
import TextField from '@material-ui/core/TextField';

const SearchWidget = (props) => (
  <div>
    <TextField
      id="standard-search"
      label="Search field"
      type="search"
      margin="normal"
      onChange={props.onChange}
    />
  </div>
);

export default SearchWidget;