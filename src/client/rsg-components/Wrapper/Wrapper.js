import { Component } from 'react';
import PropTypes from 'prop-types';

export default class Wrapper extends Component {
	static propTypes = {
		children: PropTypes.node.isRequired,
		onError: PropTypes.func.isRequired,
		currentTheme: PropTypes.string,
	};

	componentDidCatch(error) {
		this.props.onError(error);
	}

	render() {
		return this.props.children;
	}
}
