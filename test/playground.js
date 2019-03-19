/* eslint-disable no-return-assign */
import React, { Component } from 'react';
import _ from 'lodash';

class PlayGround extends Component {
  state = {
    info: {
      num1: '',
      num2: '',
      num3: '',
      num4: '',
    },
  };

  ref2 = React.createRef();

  componentDidMount() {
    console.log('this.ref1\n', this.ref1);
    console.log('this.ref2\n', this.ref2);
    console.log('this.ref3\n', this.ref3);
    console.log('this.ref4\n', this.ref4);
  }

  onChange = (path, val) => {
    const { state } = this;
    const next = _.set(_.cloneDeep(state), path, val);
    this.setState(next);
  }

  render() {
    const { state } = this;
    return (
      <div>
        <h3>Hello, World</h3>
        <pre>
          {JSON.stringify(state, null, 2)}
        </pre>
        <fieldset>
          <legend>pipe: changeAdaptor</legend>
          <input
            ref={(ref) => {
              this.ref1 = ref;
            }}
            changeAdaptor={e => e.target.value}
            kb

            type="text"
            value={state.info.num1}
            onChange={v => this.onChange('info.num1', v)}
          />
        </fieldset>
        <fieldset>
          <legend>pipe: changeAdaptor + fixed=2</legend>
          <input
            ref={this.ref2}
            changeAdaptor={e => e.target.value}
            fixed={2}

            type="text"
            value={state.info.num2}
            onChange={v => this.onChange('info.num2', v)}
          />
        </fieldset>
        <fieldset>
          <legend>pipe: changeAdaptor + kb</legend>
          <input
            ref={ref => this.ref3 = ref}

            kb
            changeAdaptor={e => e.target.value}

            type="text"
            value={state.info.num3}
            onChange={v => this.onChange('info.num3', v)}
          />
        </fieldset>
        <fieldset>
          <legend>pipe: changeAdaptor + kb + fixed=3</legend>
          <input
            ref={ref => this.ref4 = ref}

            kb
            fixed={3}
            changeAdaptor={e => e.target.value}

            type="text"
            value={state.info.num4}
            onChange={v => this.onChange('info.num4', v)}
          />
        </fieldset>
      </div>
    );
  }
}

export default PlayGround;
