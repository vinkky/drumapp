import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: '500px'
  },
  dense: {
    marginTop: 16,
  },
  menu: {
    width: 200,
  },
});

class CreateArticle extends React.Component {
  state = {
    name: 'Cat in the Hat',
    age: '',
    multiline: 'Controlled',
    currency: 'EUR',
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  render() {
    const { classes } = this.props;

    return (
      <form className={classes.container} noValidate autoComplete="off">
        <TextField
          id="outlined-name"
          label="Title"
          className={classes.textField}
          margin="normal"
          variant="outlined"
          placeholder="Enter title of the article"
        />
        <TextField
          id="outlined-multiline-static"
          label="Article body"
          multiline
          rows="4"
          placeholder="Enter article (min 30 symbols)"
          className={classes.textField}
          margin="normal"
          variant="outlined"
        />
      </form>
    );
  }
}

CreateArticle.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    auth: state.auth
  });

export default connect(mapStateToProps, {  })(withStyles(styles)(CreateArticle));