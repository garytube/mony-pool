import cheerio from 'cheerio'
import fetch from "node-fetch"
import { PaypalCampaign, Payment, User, Users, Orders, PaypalMoneyPool } from './index.d';

const anonymous: User = {
  full_name: "Anonymous 🤓"
}

/**
 *  Money Pool
 */
export = async function moneyPool(CAMPAIGN_ID: string): Promise<PaypalMoneyPool> {

  const res = await fetch('https://www.paypal.com/pools/c/' + CAMPAIGN_ID)
  const moneyPool = await res.text()
  const $ = await cheerio.load(moneyPool)

  const store = $("#store").html()
  const { campaign, contributors, txns } = await JSON.parse(store!)
  let { description, title, amount, pledge, current_value, currency, txn_count: payment_counts }: PaypalCampaign = campaign[CAMPAIGN_ID]

  let payments: Payment[] = txns.list
  const users: Users = contributors.map

  // add oweners pledge to total amount
  current_value = current_value + pledge

  const orders: Orders[] = payments.map((payment) => ({
    ...payment,
    ...users[payment.contributor_id] || anonymous

  }))


  return { description, title, amount, current_value, payment_counts, currency, orders }
}

