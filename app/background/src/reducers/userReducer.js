import {
  NETWORK_UNAVAILABLE, ADD_NEW_TIP,
  SEND_TIP, SEND_TIP_SUCCESS, SEND_TIP_ERROR, SET_ACTIVE_TAB,
  GET_TIPS, GET_TIPS_SUCCESS, GET_TIPS_ERROR, CLEAR_TIP_PENDING,
  CONNECT_AGAIN, CONNECT_AGAIN_SUCCESS, CONNECT_AGAIN_ERROR,
  BUY_GOLD, BUY_GOLD_SUCCESS, BUY_GOLD_ERROR, GET_GOLD, GET_GOLD_ERROR, CLEAR_GOLD_PENDING,
  GET_GOLD_SUCCESS, ADD_NEW_GOLD, SET_REFUND_TIPS, DIALOG_OPEN, ADD_TAB_ID, REMOVE_TAB_ID
} from '../../../constants/actionTypes';
import { NETWORK_URL, TABS } from '../../../constants/general';

export const reducerName = 'user';

// Registering is the state while he sends data to the contract
// Verifying is when he is waiting for a response from Oreclize

const INITIAL_STATE = {
  networkActive: true,
  networkUrl: NETWORK_URL,
  sendingTip: false,
  sendingTipError: '',
  sendingTipSuccess: false,
  refundTipIndex: '',
  refundTipUsername: '',
  activeTab: TABS[0].slug,
  gettingTips: false,
  gettingTipsError: '',
  tips: [],
  connectingAgain: false,
  connectingAgainError: '',
  buyingGold: false,
  buyingGoldError: '',
  buyingGoldSuccess: false,
  golds: [],
  gettingGold: false,
  gettingGoldError: '',
  dialogWindowId: 0,
  tabsIds: []
};

export const reducer = (state, action) => {
  const payload = action.payload;

  switch (action.type) {
    case DIALOG_OPEN:
      return {
        ...state,
        dialogWindowId: action.id,
      };

    case SET_ACTIVE_TAB:
      return { ...state, activeTab: payload };

    case NETWORK_UNAVAILABLE:
      return { ...state, networkActive: false };

    case SEND_TIP:
      return { ...state, sendingTip: true };
    case SEND_TIP_SUCCESS:
      return { ...state, sendingTip: false, sendingTipError: '', sendingTipSuccess: true };
    case SEND_TIP_ERROR:
      return {
        ...state,
        sendingTip: false,
        sendingTipSuccess: false,
        sendingTipError: 'An error occurred while sending tip, please try again.'
      };
    case CLEAR_TIP_PENDING:
      return {
        ...state,
        sendingTip: false,
        sendingTipSuccess: false,
        sendingTipError: ''
      };

    case GET_TIPS:
      return { ...state, gettingTips: true };
    case GET_TIPS_SUCCESS:
      return {
        ...state,
        tips: payload,
        gettingTips: false,
        gettingTipsError: ''
      };
    case GET_TIPS_ERROR:
      return {
        ...state,
        gettingTips: false,
        gettingTipsError: 'An error occurred while getting tips, please try again.'
      };
    case ADD_NEW_TIP: {
      const tips = [...state.tips];
      const tip = payload.tip;

      if (tip.from === payload.address) {
        const sentTip = Object.assign({}, tip);
        sentTip.type = 'sent';
        tips.unshift(sentTip);
      }

      if (tip.to === payload.username) {
        const receivedTip = Object.assign({}, tip);
        receivedTip.type = 'received';
        tips.unshift(receivedTip);
      }

      return { ...state, tips };
    }

    case GET_GOLD:
      return { ...state, gettingGold: true };
    case GET_GOLD_SUCCESS:
      return {
        ...state,
        golds: payload,
        gettingGold: false,
        gettingGoldError: ''
      };
    case GET_GOLD_ERROR:
      return {
        ...state,
        gettingGold: false,
        gettingGoldError: 'An error occurred while getting gold, please try again.'
      };

    case ADD_NEW_GOLD: {
      const golds = [...state.golds];
      const gold = payload.gold;

      if (gold.from === payload.address) {
        const sentGold = Object.assign({}, gold);
        sentGold.type = 'sent';
        golds.unshift(sentGold);
      }

      if (gold.to === payload.username) {
        const receivedGold = Object.assign({}, gold);
        receivedGold.type = 'received';
        golds.unshift(receivedGold);
      }

      return { ...state, golds };
    }

    case CONNECT_AGAIN:
      return { ...state, connectingAgain: true };
    case CONNECT_AGAIN_SUCCESS:
      return { ...state, connectingAgain: false, connectingAgainError: '' };
    case CONNECT_AGAIN_ERROR:
      return {
        ...state,
        connectingAgain: false,
        connectingAgainError: 'Still could not connect, please try again.'
      };

    case BUY_GOLD:
      return { ...state, buyingGold: true };
    case BUY_GOLD_SUCCESS:
      return { ...state, buyingGold: false, buyingGoldError: '', buyingGoldSuccess: true };
    case BUY_GOLD_ERROR:
      return {
        ...state,
        buyingGold: false,
        buyingGoldSuccess: false,
        buyingGoldError: 'An error occurred while buying gold, please try again.'
      };
    case CLEAR_GOLD_PENDING:
      return {
        ...state,
        buyingGold: false,
        buyingGoldSuccess: false,
        buyingGoldError: ''
      };

    case SET_REFUND_TIPS:
      return { ...state, tips: payload };

    case ADD_TAB_ID:
      return { ...state, tabsIds: [...state.tabsIds, payload] };

    case REMOVE_TAB_ID: {
      let allTabIds = [state.tabsIds];
      const tabIndex = allTabIds.findIndex((id) => id === payload);
      allTabIds = tabIndex.splice(tabIndex, 1);

      return { ...state, tabsIds: allTabIds };
    }


    default:
      return false;
  }
};

export const data = {
  name: reducerName,
  initialState: INITIAL_STATE,
  handle: reducer,
  async: false
};
