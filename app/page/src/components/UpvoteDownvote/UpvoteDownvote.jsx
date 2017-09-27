import React from 'react';
import { connect } from 'react-redux';
import UpIcon from '../Decorative/UpIcon/UpIcon';
import DownIcon from '../Decorative/DownIcon/DownIcon';
import { count } from '../../../../actions/voteActions';

const UpvoteDownvote = ({count, onClick}) => (
  <div>
    <span onClick={ onClick }><UpIcon /></span>
    <span>{ count }</span>
    <span><DownIcon /></span>
  </div>
);

UpvoteDownvote.defaultProps = {
  count: 0
};

const mapStateToProps = (state) => ({
  count: state.count
});

const mapDispatchToProps = (dispatch) => {
  return {
    onClick: () => { dispatch(count()); }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(UpvoteDownvote);
