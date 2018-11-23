import React from "react";

class SampleSelector extends React.Component {
  state = {
    open: false
  };
  constructor(props) {
    super(props);
    this.state = {open: false};
  }

  open = (event) => {
    event.preventDefault();
    this.setState({open: true});
  };

  close = () => {
    this.setState({open: false});
  };

  onChange = (event) => {
    const {id, onChange} = this.props;
    onChange(id, event.target.value);
    this.close();
  };

  render() {
    const {current, source} = this.props;
    const {open} = this.state;
    if (open) {
      return (
        <select 
          className="SelectList"    
          style={{backgroundColor: "#747474"}}autoFocus value={current} onChange={this.onChange} onBlur={this.close}>{
            source.map((sample, i) => {
              return <option key={i}>{sample}</option>;
            })
          }</select>
      );
    } else {
      return <a href="" onClick={this.open}>{current}</a>;
    }
  }
}
export default SampleSelector;