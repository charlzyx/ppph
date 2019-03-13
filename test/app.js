import React, { Component } from 'react';

const ShowProps = (props) => {
  console.log('Show props:\n', props);
  return `my props is: \n${JSON.stringify(props)}`;
};


class App extends Component {

  render() {
    return (
      <div>
        <ShowProps p1="p1" p2="p2" p3="p3">
          hello, ppph
        </ShowProps>
      </div>
    );
  }
}

export default App;
