/* eslint-disable no-unused-vars */
import React from "react";
import Table from "@material-ui/core/List";
import PropTypes from "prop-types";

class List extends React.Component {
  render() {
    return (
      <Table style={{width: "230px"}}>
        {	this.props.items.map((item,	index)	=>	this.props.itemRenderer(item,	index))	}
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