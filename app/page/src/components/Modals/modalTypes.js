import TipModal from './TipModal/TipModal';
import GoldModal from './GoldModal/GoldModal';

// Register modal types here
export const GOLD_MODAL = 'gold_modal';
export const TIP_MODAL = 'tip_modal';

export default {
  [TIP_MODAL]: TipModal,
  [GOLD_MODAL]: GoldModal
};
