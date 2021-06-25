import React from 'react';
import { connect } from 'react-redux';
import Map from './Map';
import MapBox from './MapBox';

/**
 * COMPONENT
 */
export const Home = (props) => {
  const { username } = props;

  return (
    <div>
      <h1 id="website-header">Meet in the Middle</h1>
      <div className="main">
        <MapBox />
      </div>
    </div>
  );
};

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    username: state.auth.username,
  };
};

export default connect(mapState)(Home);
