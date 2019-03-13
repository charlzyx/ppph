# **P**ipe **P**rops **P**ass to **H**oc

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
```js

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { piper } from 'ppph';

/*
 * piper(who, when, how, why) => Pipe
 * @param who string; name for pipe
 * @param when (type, wantProps) => boolean | any; when to use the pipe
 * @param how: (Comp: ReactElement) => ReactElement, how to deal with HOC
 * @param why (e) => void; will be call when error occur.
 */

export const P1HOC = (Comp) => {
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
      return <Comp {...ctx} p1={1} pv1="v1" />;
    }
  }
  hoistNonReactStatics(P1, Comp);
  return P1;
};
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
