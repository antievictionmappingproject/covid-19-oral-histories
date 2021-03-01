import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

export default props => {
  const interviewSelected = useSelector(state => state.ui.interviewSelected);
  const dispatch = useDispatch();

  return (
    <div className="aemp-infowindow">
      <span
        className="aemp-infowindow-close"
        onClick={() => {
          dispatch({ type: 'ui:interview:selected', payload: null });
        }}
      >
        ×
      </span>
      <div>{JSON.stringify(interviewSelected)}</div>
    </div>
  );
};
