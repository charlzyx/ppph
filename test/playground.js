/* eslint-disable no-return-assign */
import React, { Component } from 'react';
import _ from 'lodash';

class PlayGround extends Component {
  state = {
    vmap: {
      num1: true,
      num2: true,
      num3: true,
      num4: true,
    },
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
    setTimeout(() => {
      console.log('this.ref1\n', this.ref1);
      console.log('this.ref2\n', this.ref2);
      console.log('this.ref3\n', this.ref3);
      console.log('this.ref4\n', this.ref4);
    }, 2000);
  }

  toggle = (key) => {
    const { vmap } = this.state;
    this.setState({
      vmap: {
        ...vmap,
        [key]: !vmap[key],
      },
    });
  }


  onChange = (path, val) => {
    const { state } = this;
    const next = _.set(_.cloneDeep(state), path, val);
    this.setState(next);
  }

  render() {
    const { state } = this;
    const { vmap } = this.state;
    return (
      <div>
        <h3>Hello, World</h3>
        <pre>
          {JSON.stringify(state, null, 2)}
        </pre>
        <div>
          <button type="button" onClick={() => this.toggle('num1')}>num1</button>
          <button type="button" onClick={() => this.toggle('num2')}>num2</button>
          <button type="button" onClick={() => this.toggle('num3')}>num3</button>
          <button type="button" onClick={() => this.toggle('num4')}>num4</button>
        </div>
        {vmap.num1
          ? (
            <fieldset>
              <legend>pipe: changeAdaptor</legend>
              <input
                ref={(ref) => {
                  this.ref1 = ref;
                }}
                kb
                auth

                type="text"
                value={state.info.num1}
                onChange={v => this.onChange('info.num1', v)}
              />
            </fieldset>
          )
          : null
        }
        {vmap.num2
          ? (
            <fieldset>
              <legend>pipe: changeAdaptor</legend>
              <input
                ref={(ref) => {
                  this.ref3 = ref;
                }}
                changeAdaptor={e => e.target.value}

                type="text"
                value={state.info.num2}
                onChange={v => this.onChange('info.num2', v)}
              />
            </fieldset>
          )
          : null
        }
        {/* <fieldset>
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
        </fieldset> */}
      </div>
    );
  }
}

export default PlayGround;
