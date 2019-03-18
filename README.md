# **P**ipes **P**rops **P**ass to **H**oc

```js
/**
 * ----------------------------------------------------------------------------
 * ppph: Pipe Props Pass to Hoc
 * ----------------------------------------------------------------------------
 * // in code
 *   <AnyComp p1="p1" p2="p2" p3="p3" />
 * ->
 * // in Chrome React DevTools
 *  <P3 p1="p1" p2="p2" p3="p3">
 *    <P2 p1="p1" p2="p2" p3="p3">
 *      <P1 p1="p1" p2="p2" p3="p3">
 *        <AnyComp p1="p1" p2="p2" p3="p3" />
 *      </P1>
 *    </P2>
 *  </P3>
 * ----------------------------------------------------------------------------
 * PipeHOC diff with normal HOC
 * 1. statics:  because is no decorator or HOC(Comp) to write, so statics is no need to hoist
 * 2. forwardRef: will be 2nd param for Pipe HOC, gift for you.
 * ----------------------------------------------------------------------------
 * runtime surprise!
 */
```

> before
```jsx
// code
<AnyComp p1="p1" p1="p2" p1="p3" />
```

> after
```jsx
// look at React DevTools
<P3 p1="p1" p2="p2" p3="p3">
  <P2 p1="p1" p2="p2" p3="p3">
    <P1 p1="p1" p2="p2" p3="p3">
      <AnyComp
        // changed props
        p1={1}
        p2={2}
        p1={3}
        // addon props by jsx
        pv1="v1"
        pv2="v2"
        pv3="v3"
        // ctx pass
        pass={
          p1: true,
          p2: true,
          p3: true,
        }
      />
    </P1>
  </P2>
</P3
```

> use

```js
/**
* the entry:  where `ReactDOM.render(<App />, document.getElementById('#app'))`
*/

import React from 'react';
import ReactDOM from 'react-dom';
import ppph from 'ppph';
import { p1, p2, p3 } from './your/pipes';

ppph.use(p1);
ppph.use(p2);
ppph.use(p3);
ppph.inject();

ReactDOM.render(<App />, document.getElementById('#app'));
```

> api & example for pipe

[npm run d](./test)

```js

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { piper } from 'ppph';

/**
 * pipe for ppph's constructor
 * @param who string; name for pipe
 * @param when (type, props) => boolean | any; when to use the pipe
 * @param how: (Comp: ReactElement) => ReactElement, how to deal with HOC
 * @param why (e) => void; will be call when error occur.
 * @param ph [ph, key]; the sort important value for your pipe,
 * smaller ph mean height power just like pH, key is sort by your props write sort, default ph is 7.
 * @constructor
 */

export const P1HOC = (Comp, forwardRef) => {
  class P1 extends Component {
    static propTypes = {
      pass: PropTypes.object,
    };
    componentDidMount() {
      console.log('p1 did mount');
    }

    render() {
      const { pass = {} } = this.props;
      const ctx = {
        ...this.props,
        pass: {
          ...pass,
          p1: true,
        },
      };
      console.log('P1 render', this.props);
      // don't forget forwardRef, two ways to do this
      // 1. like react doc
      // return <Comp {...ctx} ref={this.props.forwardRef} p1={1} pv1="v1" />;
      // 2. friendly, the 2nd param is the forwardRef, so you can easily write by this
      return <Comp {...ctx} ref={forwardRef} p1={1} pv1="v1" />;
    }
  }
  return P1;
};

export const p1 = piper({
  who: 'p1',
  when: (type, props) => props.p1,
  how: P1HOC,
  why: (e) => { console.log('P1HOC', e); },
  ph: [-100, 'p1'],
});

```

> how

by inject `React.createElement`

> inspired

- [HOC](https://reactjs.org/docs/higher-order-components.html)
- [pexs](https://wnpm.corp.bianlifeng.com/package/@wnpm/pexs)
- [luker](https://wnpm.corp.bianlifeng.com/package/@wnpm/lurker)
- [koa](https://github.com/koajs/koa/)
- [react-powerplug](https://github.com/renatorib/react-powerplug)
- [rematch](https://github.com/rematch/rematch)
- [dva](https://github.com/dvajs/dva)
