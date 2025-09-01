import Ad from '../models/Ad.js';
import Wallet from '../models/Wallet.js';
import { scoreAd } from '../utils/scoreAd.js';


function inSchedule(ad, date = new Date()) {
if (!ad.schedule) return true;
const { startDate, endDate, daysOfWeek = [], timesOfDay = [] } = ad.schedule;
if (startDate && date < new Date(startDate)) return false;
if (endDate && date > new Date(endDate)) return false;
if (daysOfWeek.length && !daysOfWeek.includes(date.getDay())) return false;
if (timesOfDay.length) {
const hhmm = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
const within = timesOfDay.some(({ start, end }) => start <= hhmm && hhmm <= end);
if (!within) return false;
}
return true;
}


function devicePass(ad, userCtx) {
const list = ad?.targeting?.device || [];
return !list.length || list.includes(userCtx.device);
}


export async function selectAds(userCtx, limit = 1) {
// Fetch active ads with enough wallet balance for at least minimal charge
const ads = await Ad.find({ status: 'active' }).lean();


const scored = [];
for (const ad of ads) {
if (!inSchedule(ad)) continue;
if (!devicePass(ad, userCtx)) continue;


// Ensure advertiser wallet has funds
const wallet = await Wallet.findOne({ advertiserId: ad.advertiserId }).lean();
if (!wallet || wallet.walletBalance <= 0) continue;


const score = scoreAd(ad, userCtx);
if (score > 0) scored.push({ ad, score });
}


scored.sort((a, b) => b.score - a.score);
return scored.slice(0, limit).map(s => s.ad);
}