import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { quickSort } from "../../../../actions/utils"

class SortComments extends Component {
    constructor(props) {
        super(props);

        this.state = {};

        this.renderPosts = this.renderPosts.bind(this);
    }

    static epoch_seconds(date) {
        let epoch = new Date(1970, 1, 1);
        let td = date - epoch;

        return td.days * 86400 + td.seconds + (td.miliseconds.toDecimal(3) / 1000000)
    };

    hot(ups, downs, date) {
        let s = ups - downs;
        let order = Math.log(max(abs(s), 1)) / Math.log(10);
        let sign = Math.sign(s);
        let seconds = this.epoch_seconds(date) - 1134028003;

        return round(order + sign * seconds / 45000, 7);
    }

    renderPosts() {
        let posts = this.state.posts;

        posts.each(function (post) {
            post.hot = this.hot(post.ups, post.downs, new Date());
        });

        quickSort(posts, 0, posts.length - 1);
    }
}
SortComments.propTypes = {
    posts: PropTypes.array.isRequired,
};
const mapStateToProps = (state) => ({
    posts: state.posts,
});
export default connect(mapStateToProps, {})(SortComments);