/* eslint-disable react/no-multi-comp, no-console,react/prop-types */
import React, { Component } from 'react';
import { piper } from '../src/main';

/**
 * ----------------------------------------------------------------------------
 * diff with normal HOC
 * 1. statics:  because is no decorator or HOC(Comp) to write, so statics is no need to hoist
 * 2. forwardRef: will be 2nd param for Pipe HOC, gift for you.
 * ----------------------------------------------------------------------------
 */

const toFloat = (n) => {
  const num = parseFloat(n);
  const isNaN = Number.isNaN(num);
  return isNaN ? 0 : num.toFixed(2);
};

// look at the ref
const KBSupportHOC = (Comp, forwardRef) => {
  class KBSupport extends Component {
    onKeyDown = (e) => {
      const { value = 0, onChange } = this.props;
      if (e.key === 'ArrowUp') {
        const next = +value + 1;
        onChange(next);
      }
      if (e.key === 'ArrowDown') {
        const next = +value - 1;
        onChange(next);
      }
    }

    render() {
      console.log('kb', this.props);
      // don't forget forwardRef, two ways to do this
      // 1. like react doc
      // return <Comp {...this.props} ref={this.props.forwardRef} onKeyDown={this.onKeyDown} />;
      // 2. friendly, the 2nd param is the forwardRef, so you can easily write by this
      return <Comp {...this.props} ref={forwardRef} onKeyDown={this.onKeyDown} />;
    }
  }

  return KBSupport;
};

// look at the ref
export const ChangeAdaptorHOC = (Comp, forwardRef) => {
  class ChangeAdaptor extends Component {
    onChange = (e) => {
      const { onChange, changeAdaptor = v => v } = this.props;
      onChange(changeAdaptor(e));
    }

    render() {
      // don't forget forwardRef, two ways to do this
      // 1. like react doc
      // return <Comp {...this.props} ref={this.props.forwardRef} onChange={this.onChange} />;
      // 2. friendly, the 2nd param is the forwardRef, so you can easily write by this
      return <Comp {...this.props} ref={forwardRef} onChange={this.onChange} />;
    }
  }
  return ChangeAdaptor;
};

// look at the ref
const FixedIoHOC = (Comp, forwardRef) => {
  class FixedInput extends Component {
    componentWillReceiveProps(nextProps) {
      const { value, onChange } = nextProps;
      const next = toFloat(value);
      if (next !== value) {
        onChange(next);
      }
    }

    render() {
      // don't forget forwardRef, two ways to do this
      // 1. like react doc
      // return <Comp {...this.props} ref={this.props.forwardRef} />;
      // 2. friendly, the 2nd param is the forwardRef, so you can easily write by this
      return <Comp {...this.props} ref={forwardRef} />;
    }
  }

  return FixedInput;
};

/**
 * Pipe
 * @type {Pipe}
 */
export const KBSupportPipe = piper({
  who: 'kbSupport',
  when: (type, props) => props.kb,
  how: KBSupportHOC,
  why: (e) => { console.log('AdaptorHOC', e); },
});

export const FixedIoPipe = piper({
  who: 'fixed',
  when: (type, props) => props.fixed,
  how: FixedIoHOC,
  why: (e) => { console.log('FixedIoHOC', e); },
  ph: [-20, 'fixed'],
});


export const changeAdaptorPipe = piper({
  who: 'changeAdaptor',
  when: (type, props) => props.changeAdaptor,
  how: ChangeAdaptorHOC,
  why: (e) => { console.log('AdaptorHOC', e); },
  ph: [-100, 'changeAdaptor'],
});
