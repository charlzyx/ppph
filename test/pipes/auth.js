import React, { Component, forwardRef } from 'react';
import PropTypes from 'prop-types';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { piper } from '../../src/main';

/**
 * --------------------------------------------
 * PipeHOCAuth
 * --------------------------------------------
 * introduce your pipeHOC
 */

const http = () => new Promise((resolve) => {
  setTimeout(() => {
    resolve();
  }, 1000);
});

const PipeHOCAuth = (Comp) => {
  class PipeAuthWrapper extends Component {
    static displayName = `PipeAuthWrapper${Comp.displayName || Comp.name || ''}`;

    static propTypes = {
      forwardRef: PropTypes.oneOfType([
        PropTypes.func,
        // Element is just window.Element, this type for React.createRef()
        PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
      ]),
    };

    static defaultProps = {
      forwardRef: null,
    }

    state = {
      authed: false,
    };

    componentDidMount() {
      http().then(() => {
        this.setState({ authed: true });
      });
    }

    render() {
      const { props } = this;
      const { authed } = this.state;
      const nextProps = {
        ...props,
        ref: props.forwardRef,
      };
      return authed ? <Comp {...nextProps} /> : 'authing...';
    }
  }

  // it is not need for ppph, but it better to make your PipeHOC common.
  hoistNonReactStatics(PipeAuthWrapper, Comp);
  // forward the ref.
  return forwardRef((props, ref) => <PipeAuthWrapper {...props} forwardRef={ref} />);
};

/**
 * @param who required. type: String;
 * @param when required. type: (type, props) => boolean | any;
 * @param how required. type: (Comp: ReactElement) => ReactElement;
 * @param why required. type: (e) => void;
 * @param ph type: [pH, key];
 *
 */

/**
 * --------------------------------------------
 * pipe auth
 * --------------------------------------------
 * introduce your pipe
 */
export default piper({
  who: 'auth', // name for pipe
  when: (type, props) => props.auth, // condition to use the pipe
  how: PipeHOCAuth, // the HOC for this pipe, means how to deal with it
  why: (e) => { // a callback will be call when error occur.
    console.error('[PipeHOCAuth] error: ');
    console.dir(e);
  },
  // pH: means sort weight, just like pH, the lower pH value, the heighter sort weight;
  // key: pependent key name in JSX, which will be sort by write order;
  ph: [7, 'auth'],
});
