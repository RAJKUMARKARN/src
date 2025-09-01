import Ad from '../models/Ad.js';
import Wallet from '../models/Wallet.js';
import Log from '../models/Log.js';

export async function chargeEvent(adId, eventType, metadata = {}) {
  // Fetch the ad
  const ad = await Ad.findById(adId);
  if (!ad) throw new Error('Ad not found');

  // Fetch advertiser's wallet
  const wallet = await Wallet.findOne({ advertiserId: ad.advertiserId });
  if (!wallet) throw new Error('Wallet not found');

  let cost = 0;

  // Billing logic based on event type
  switch (eventType) {
    case 'impression':
      if (ad.billingModel === 'CPM') {
        cost = ad.bidAmount / 1000; // cost per impression
      }
      break;

    case 'click':
      if (ad.billingModel === 'CPC') {
        cost = ad.bidAmount; // cost per click
      }
      break;

    case 'conversion':
      if (ad.billingModel === 'CPA') {
        cost = ad.bidAmount; // cost per conversion
      }
      break;

    default:
      throw new Error(`Unsupported event type: ${eventType}`);
  }

  // Deduct from wallet
  if (cost > 0) {
    if (wallet.walletBalance < cost) {
      throw new Error('Insufficient wallet balance');
    }

    wallet.walletBalance -= cost;
    wallet.totalSpent += cost;
    await wallet.save();
  }

  // Log the event
  await Log.create({
    adId: ad._id,
    advertiserId: ad.advertiserId,
    eventType,
    cost,
    metadata,
    timestamp: new Date(),
  });

  return { success: true, charged: cost };
}