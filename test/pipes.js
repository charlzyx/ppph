
import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { piper } from '../src/main';

export const P1HOC = (Comp) => {
  class P1 extends Component {
    componentDidMount() {
      console.log('p1 did mount');
    }

    render() {
      const ctx = {
        ...this.props,
        pass: {
          ...(this.props.pass || {}),
          p1: true,
        },
      };
      console.log('P1 render', this.props);
      return <Comp {...ctx} p1={1} pv1="v1" />;
    }
  }
  hoistNonReactStatics(P1, Comp);
  return P1;
};

export const P2HOC = (Comp) => {
  class P2 extends Component {
    componentDidMount() {
      console.log('p2 did mount');
    }

    render() {
      const ctx = {
        ...this.props,
        pass: {
          ...(this.props.pass || {}),
          p2: true,
        },
      };
      console.log('P2 render', this.props);
      return <Comp {...ctx} p2={2} pv2="v2" />;
    }
  }
  hoistNonReactStatics(P2, Comp);
  return P2;
};
export const P3HOC = (Comp) => {
  class P3 extends Component {
    componentDidMount() {
      console.log('p3 did mount');
    }

    render() {
      const ctx = {
        ...this.props,
        pass: {
          ...(this.props.pass || {}),
          p3: true,
        },
      };
      console.log('P3 render', this.props);
      return <Comp {...ctx} p3={3} pv3="v3" />;
    }
  }
  hoistNonReactStatics(P3, Comp);
  return P3;
};

export const p1 = piper({
  who: 'p1',
  when: (type, props) => props.p1,
  how: P1HOC,
  why: (e) => { console.log('p1', e); },
});
export const p2 = piper({
  who: 'p2',
  when: (type, props) => props.p2,
  how: P2HOC,
  why: (e) => { console.log('p2', e); },
});
export const p3 = piper({
  who: 'p3',
  when: (type, props) => props.p3,
  how: P3HOC,
  why: (e) => { console.log('p3', e); },
});
