/* eslint-disable no-unused-vars */
import React from "react";
import Table from "@material-ui/core/List";
import PropTypes from "prop-types";
import AudioItem from "./AudioItem";

class List extends React.Component {
  render() {
    return (
      <Table style={{width: "230px"}}>
        {	this.props.items.map(audioFile => <AudioItem key={audioFile._id} audioFile={audioFile} deleteAudio={this.props.deleteAudio}/>)	}
      </Table>
    );
  }
}


List.propTypes 	=	{		
  items: PropTypes.array,
  itemRenderer: PropTypes.func.isRequired
}; 
List.defaultProps	=	{	items:	[]	};


export default List;