/* eslint-disable no-unused-vars */
import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import SettingsIcon from "@material-ui/icons/Settings";
import PlayIcon from "@material-ui/icons/playarrow";
import PauseIcon from "@material-ui/icons/pause";


class AudioItem extends React.Component {
  constructor(props) {
    super(props);
    this.audio = new Audio;
    this.state = {
      playing: false
    };
    this.audio.src = `http://localhost:5070/tracks/${this.props.filename}`;
    console.log(this.props._id)
  }

  componentWillMount() {
    this.audio.addEventListener("ended", (e) =>{
      this.setState({playing: false});
    }, false);
  }

 playSong = () => {
   this.setState({ playing: true });
   this.audio.play(); 

 }
 pauseSong = () => {
   this.setState({ playing: false });
   this.audio.pause();
 }

  togglePause = () =>{
    if (this.audio.paused) {
      this.playSong();
    } else {
      this.pauseSong();
    }
  }

  render() {
    return (
      <ListItem>
        <ListItemText
          primary={this.props.filename}
        />
        <ListItemSecondaryAction>
          <IconButton aria-label="Delete">
            {!this.state.playing ?  <PlayIcon onClick={() => this.togglePause(this.props.filename)} /> :  <PauseIcon onClick={() => this.togglePause()} />}
          </IconButton>
          <IconButton aria-label="Delete">
            <SettingsIcon />
          </IconButton>
          <IconButton aria-label="Delete" onClick={() => this.props.deleteAudio(this.props._id)}>
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    );
  }
}


export default AudioItem;