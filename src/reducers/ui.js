const initialState = {
  showModal: true,
  showLoadingIndicator: true,
  infoWindowFeatureProps: null,
  language: 'en',
  searchTerm: '',
  searchResults: null,
};
export default (state = initialState, action) => {
  switch (action.type) {
    case 'ui:modal:show':
      return { ...state, showModal: true };
    case 'ui:modal:hide':
      return { ...state, showModal: false };
    case 'ui:loading-indicator:show':
      return { ...state, showLoadingIndicator: true };
    case 'ui:loading-indicator:hide':
      return { ...state, showLoadingIndicator: false };
    case 'ui:language:set':
      return { ...state, language: action.payload };
    case 'ui:search:term:set':
      return { ...state, searchTerm: action.payload };
    case 'ui:search:results:set':
      return { ...state, searchResults: action.payload };
    case 'ui:interview:selected':
      return { ...state, interviewSelected: action.payload };
    default:
      return state;
  }
};
