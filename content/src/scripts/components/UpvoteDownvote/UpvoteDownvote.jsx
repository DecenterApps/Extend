import React from 'react';
import { connect } from 'react-redux';
import UpIcon from '../Decorative/UpIcon/UpIcon'
import DownIcon from '../Decorative/DownIcon/DownIcon'

const UpvoteDownvote = ({count}) => (
  <div>
    <span><UpIcon /></span>
    <span><DownIcon /></span>
  </div>
);


const mapStateToProps = (state) => ({
  count: state.count
});

export default connect(mapStateToProps)(UpvoteDownvote);
