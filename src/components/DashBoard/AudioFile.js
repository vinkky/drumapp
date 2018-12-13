/* eslint-disable no-unused-vars */
import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import SettingsIcon from "@material-ui/icons/Settings";
import PlayIcon from "@material-ui/icons/playarrow";


const AudioFile = (props) => {
  return (
    <ListItem>
      <ListItemText
        primary="Single-line item"
      />
      <ListItemSecondaryAction>
        <IconButton aria-label="Delete">
          <PlayIcon />
        </IconButton>
        <IconButton aria-label="Delete">
          <SettingsIcon />
        </IconButton>
        <IconButton aria-label="Delete">
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default AudioFile;