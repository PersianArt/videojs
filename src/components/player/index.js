import React, { Component, PropTypes, Fragment } from 'react';
import ReactDOM from 'react-dom';
import { Button, Dropdown, Icon } from 'antd';
import videojs from 'video.js';
import '@videojs/http-streaming';
import 'video.js/dist/video-js.css';
import 'videojs-hls-quality-selector';
import 'videojs-contrib-quality-levels';




/**
 * EpisodeList.js
 *
 * This is just a plain ol' React component.
 * the vjsComponent methods, player methods etc. are available via
 * the vjsComponent prop (`this.props.vjsComponent`)
 */

class Settings extends Component {
	constructor(props) {
		super(props);

		this.player = this.props.player;
		this.qualityList = this.player.qualityLevels();

		this.state = {
			levels: [],
			current: 'auto'
		};

		this.qualityList.on('addqualitylevel', () => {
			this.setState({
				levels: this.qualityList.levels_,
			})
		});
	}

	setQuality(height) {
		const qualityList = this.player.qualityLevels();

		for (let i = 0; i < qualityList.length; ++i) {
			const quality = qualityList[i];

			quality.enabled = (quality.height === height || height === 'auto');
		}

		this.menu.classList.add('vjs-hidden');
		this.setState({current: height})
		// this._qualityButton.unpressButton();
	}

	render() {
		const { levels, current } = this.state;

		console.log('levels', levels);

		return (
			<Fragment>
				<button onMouseEnter={() => this.menu.classList.remove('vjs-hidden')} className="vjs-menu-button vjs-menu-button-popup vjs-button" type="button" title="Settings" aria-disabled="false" aria-haspopup="true" aria-expanded="false">
					<span aria-hidden="true" className="vjs-icon-placeholder vjs-icon-forward-10"/>
					<span className="vjs-control-text" aria-live="polite">Settings</span>
				</button>
				<div ref={el => this.menu = el} className="vjs-menu">
					<ul className="vjs-menu-content" role="menu">
						<li className="vjs-menu-title" tabIndex="-1">Quality</li>
						{levels.map((item, i) =>
							<li key={i} onClick={() => this.setQuality(item.height)} className={`vjs-menu-item ${current === item.height ? 'vjs-selected' : ''}`} tabIndex="-1" role="menuitemradio" aria-disabled="false" aria-checked={current === item.height}>
								<span className="vjs-menu-item-text">{item.height}p</span>
								<span className="vjs-control-text" aria-live="polite"></span>
							</li>
						)}
						<li onClick={() => this.setQuality('auto')} className={`vjs-menu-item ${current === 'auto' ? 'vjs-selected' : ''}`} tabIndex="-1" role="menuitemradio" aria-disabled="false" aria-checked={current === 'auto'}>
							<span className="vjs-menu-item-text">Auto</span>
							<span className="vjs-control-text" aria-live="polite"></span>
						</li>
					</ul>
				</div>
			</Fragment>
		);
	}
}


/**
 * vjsEpisodeList.js
 *
 * Here is where we register a Video JS Component and
 * mount the React component to it when the player is ready.
 */

const vjsComponent = videojs.getComponent('Component');

class vjsSettings extends vjsComponent {

	constructor(player, options) {
		super(player, options);

		/* Bind the current class context to the mount method */
		this.mount = this.mount.bind(this);

		/* When player is ready, call method to mount React component */
		player.ready(() => {
			this.mount(player);
		});

		this.el().classList.add('vjs-menu-button', 'vjs-menu-button-popup', 'vjs-control', 'vjs-button', 'vjs-quality-selector');

		/* Remove React root when component is destroyed */
		this.on("dispose", () => {
			ReactDOM.unmountComponentAtNode(this.el())
		});
	}

	/**
	 * We will render out the React EpisodeList component into the DOM element
	 * generated automatically by the VideoJS createEl() method.
	 *
	 * We fetch that generated element using `this.el()`, a method provided by the
	 * vjsComponent class that this class is extending.
	 */
	mount(player) {
		ReactDOM.render(<Settings vjsComponent={this} player={player} />, this.el() );
	}
}

/**
 * Make sure to register the vjsComponent so Video JS knows it exists
 */
vjsComponent.registerComponent('vjsSettings', vjsSettings);






export default class VideoPlayer extends React.Component {
	componentDidMount() {
		// instantiate Video.js
		this.player = videojs(this.videoNode, this.props, function onPlayerReady() {
			console.log('onPlayerReady', this)
		});

		/**
		 * Fetch the controlBar component and add the new vjsEpisodeList component as a child
		 * You can pass options here if desired in the second object.
		 */
		this.player.getChild('controlBar').addChild('vjsSettings', {});
		// this.player.hlsQualitySelector();
	}

	// destroy player on unmount
	componentWillUnmount() {
		if (this.player) {
			this.player.dispose()
		}
	}

	// wrap the player in a div with a `data-vjs-player` attribute
	// so videojs won't create additional wrapper in the DOM
	// see https://github.com/videojs/video.js/pull/3856
	render() {
		return (
			<div>
				<div style={{margin: '0 auto'}} data-vjs-player>
					<video ref={ node => this.videoNode = node } className="video-js"></video>
				</div>
			</div>
		)
	}
}


export const videoJsOptions = {
	autoplay: false,
	controls: true,
	sources: [{
		src: 'https://www.myapps.ir/delivery/video/video/play/2814/v.m3u8?domain=myapps',
		type: 'application/x-mpegURL',
	},{
		src: 'https://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8',
		type: 'application/x-mpegURL',
	},{
		src: 'https://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8',
		type: 'application/x-mpegURL',
	}]
}