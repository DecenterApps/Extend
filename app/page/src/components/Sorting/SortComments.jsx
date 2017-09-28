import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { quickSort } from "../../../../actions/utils"

class SortComments extends Component {
    constructor(props) {
        super(props);

        this.state = {};

        this.renderComments = this.renderComments().bind(this);
    }

    static confidence(ups, downs) {
        let n = ups + downs;

        if (n === 0)
            return 0;

        let z = 1.281551565545;
        let p = ups.toFixed(3) / n;

        let left = p + 1 / (2 * n) * z * z;
        let right = z * sqrt(p * (1 - p) / n + z * z / (4 * n * n));
        let under = 1 + 1 / n * z * z;

        return (left - right) / under
    }

    renderComments() {
        let comments = this.state.posts;

        comments.each(function (comment) {
            comment.hot = this.confidence(comment.ups, comment.downs, new Date());
        });

        quickSort(comments, 0, comments.length - 1);
    }
}
SortComments.propTypes = {
    comments: PropTypes.array.isRequired,
};
const mapStateToProps = (state) => ({
    comments: state.comments,
});
export default connect(mapStateToProps, {})(SortComments);