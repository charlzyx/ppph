import React, { Component, forwardRef } from 'react';
import PropTypes from 'prop-types';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { piper } from '../../src/main';

/**
 * --------------------------------------------
 * PipeHOCKeyboardSupport
 * --------------------------------------------
 * introduce your pipeHOC
 */
const PipeHOCKeyboardSupport = (Comp) => {
  class PipeKeyboardSupportWrapper extends Component {
    static displayName = `PipeKeyboardSupportWrapper${Comp.displayName || Comp.name || ''}`;

    static propTypes = {
      forwardRef: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
      ]),
      onKeyDown: PropTypes.func,
      onChange: PropTypes.func,
      value: PropTypes.number,
    };

    static defaultProps = {
      forwardRef: null,
      onKeyDown: () => { },
      onChange: () => { },
      value: null,
    }

    onKeyDown = (e) => {
      const { value, onChange } = this.props;
      let next = value;
      if (e.key === 'ArrowUp') {
        try {
          next = +value + 1;
        } catch (error) {
          console.log('onKeyDown error', error);
        }
      }
      if (e.key === 'ArrowDown') {
        try {
          next = +value - 1;
        } catch (error) {
          console.log('onKeyDown error', error);
        }
      }

      onChange(next);
    }

    render() {
      const { props } = this;
      const nextProps = {
        ...props,
        ref: props.forwardRef,
        onKeyDown: this.onKeyDown,
      };
      return <Comp {...nextProps} />;
    }
  }

  // it is not need for ppph, but it better to make your PipeHOC common.
  hoistNonReactStatics(PipeKeyboardSupportWrapper, Comp);
  // forward the ref.
  return forwardRef((props, ref) => <PipeKeyboardSupportWrapper {...props} forwardRef={ref} />);
};

/**
 * --------------------------------------------
 * pipe keyboard
 * --------------------------------------------
 * add keyboard support for number input, ArrowUp to add 1, ArrowDown to sub 1
 */
export default piper({
  who: 'keyboardSupport', // name for pipe
  when: (type, props) => props.kb, // condition to use the pipe
  how: PipeHOCKeyboardSupport, // the HOC for this pipe, means how to deal with it
  why: (e) => { // a callback will be call when error occur.
    console.error('[PipeHOCKeyboardSupport] error: ');
    console.dir(e);
  },
  // pH: means sort weight, just like pH, the lower pH value, the heighter sort weight;
  // key: pependent key name in JSX, which will be sort by write order;
  ph: [7, ''],
});
