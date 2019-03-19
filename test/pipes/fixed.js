import React, { Component, forwardRef } from 'react';
import PropTypes from 'prop-types';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { piper } from '../../src/main';

const toFixed = (n, fixed = 2) => {
  const num = parseFloat(n);
  const isNaN = Number.isNaN(num);
  return isNaN ? 0 : num.toFixed(fixed);
};

/**
 * --------------------------------------------
 * PipeHOCFixedInput
 * --------------------------------------------
 * introduce your pipeHOC
 */
const PipeHOCFixedInput = (Comp) => {
  class PipeFixedInputWrapper extends Component {
    static displayName = `PipeFixedInputWrapper${Comp.displayName || Comp.name || ''}`;

    static propTypes = {
      forwardRef: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
      ]),
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      onChange: PropTypes.func,
      fixed: PropTypes.number,
    };

    static defaultProps = {
      forwardRef: null,
      value: null,
      onChange: () => { },
      fixed: 2,
    }

    componentWillReceiveProps(nextProps) {
      const { value, onChange, fixed } = nextProps;
      const next = toFixed(value, fixed);
      if (next !== value) {
        onChange(next);
      }
    }

    render() {
      const { props } = this;
      const nextProps = {
        ...props,
        ref: props.forwardRef,
      };
      return <Comp {...nextProps} />;
    }
  }

  // it is not need for ppph, but it better to make your PipeHOC common.
  hoistNonReactStatics(PipeFixedInputWrapper, Comp);
  // forward the ref.
  return forwardRef((props, ref) => <PipeFixedInputWrapper {...props} forwardRef={ref} />);
};

/**
 * --------------------------------------------
 * pipe fixed
 * --------------------------------------------
 * introduce your pipe
 */
export default piper({
  who: 'fixed', // name for pipe
  when: (type, props) => /\d+/.test(props.fixed), // condition to use the pipe
  how: PipeHOCFixedInput, // the HOC for this pipe, means how to deal with it
  why: (e) => { // a callback will be call when error occur.
    console.error('[PipeHOCFixedInput] error: ');
    console.dir(e);
  },
  // pH: means sort weight, just like pH, the lower pH value, the heighter sort weight;
  // key: pependent key name in JSX, which will be sort by write order;
  ph: [7, 'fixed'],
});
