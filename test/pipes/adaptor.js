import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { piper } from '../../src/main';

/**
 * --------------------------------------------
 * PipeHOCChangeAdaptor
 * --------------------------------------------
 * introduce your pipe.
 */
const PipeHOCChangeAdaptor = (Comp) => {
  // forward the ref.
  const PipeChangeAdaptorWrapper = forwardRef((props, ref) => {
    const { onChange, changeAdaptor = v => v } = props;
    const nextProps = {
      ...props,
      ref,
      onChange: (any) => {
        onChange(changeAdaptor(any));
      },
    };
    return <Comp {...nextProps} />;
  });
  PipeChangeAdaptorWrapper.displayName = `PipeChangeAdaptorWrapper${Comp.displayName || Comp.name || ''}`;

  PipeChangeAdaptorWrapper.propTypes = {
    onChange: PropTypes.func,
    changeAdaptor: PropTypes.func,
  };

  PipeChangeAdaptorWrapper.defaultProps = {
    onChange: () => { },
    changeAdaptor: () => { },
  };

  // it is not need for ppph, but it better to make your PipeHOC common.
  hoistNonReactStatics(PipeChangeAdaptorWrapper, Comp);
  return PipeChangeAdaptorWrapper;
};


/**
 * --------------------------------------------
 * pipe changeAdaptor
 * --------------------------------------------
 * adaptor onChange for input, example e => e.target.value
 */
export default piper({
  who: 'changeAdaptor', // name for pipe
  when: (type, props) => props.changeAdaptor, // condition to use the pipe
  how: PipeHOCChangeAdaptor, // the HOC for this pipe, means how to deal with it
  why: (e) => { // a callback will be call when error occur.
    console.error('[PipeHOCChangeAdaptor] error: ');
    console.dir(e);
  },
  // pH: means sort weight, just like pH, the lower pH value, the heighter sort weight;
  // key: pependent key name in JSX, which will be sort by write order;
  ph: [-233, 'changeAdaptor'],
});
