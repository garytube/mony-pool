import cheerio from 'cheerio';
import fetch from 'node-fetch';
import { PaypalCampaign, Payment, User, Users, Orders, PaypalMoneyPool } from './index.d';

const anonymous: User = {
  full_name: 'Anonymous 🤓'
};

/**
 *  Money Pool
 */
export = async function moneyPool(CAMPAIGN_ID: string): Promise<PaypalMoneyPool> {
  const res = await fetch('https://www.paypal.com/pools/c/' + CAMPAIGN_ID);
  if (res.status !== 200) throw new Error('money pool not found');

  const moneyPool = await res.text();
  const $ = await cheerio.load(moneyPool);

  const store = $('#store').html();

  if (!store) throw new Error('data not found on money pool page');

  const { campaign, contributors, txns } = await JSON.parse(store);

  if (campaign) {
    const {
      description,
      title,
      amount,
      pledge,
      current_value,
      currency,
      txn_count: payment_counts
    }: PaypalCampaign = campaign[CAMPAIGN_ID];
    const payments: Payment[] = txns.list;
    const users: Users = contributors.map;

    // add oweners pledge to total amount
    const total_value = current_value + pledge;
    // build payload
    const orders: Orders[] = payments.map((payment) => ({
      ...payment,
      ...(users[payment.contributor_id] || anonymous)
    }));
    return { description, title, amount, total_value, payment_counts, currency, orders };
  } else {
    throw new Error('money pool not found');
  }
};
