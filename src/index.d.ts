export type Payment = {
  id: string;
  campaign_id: string;
  date: Date;
  amount: number;
  anonymous: boolean;
  contributor_id: string;
  note?: string;
};

export type User = {
  full_name: string;
  photo?: string;
  has_business_name?: boolean;
};

export interface Users {
  [index: string]: User;
}

export type Orders = Payment & User;

export interface PaypalCampaign {
  owner: PaypalOwner;
  id: string;
  title: string;
  description: string;
  campaign_type: string;
  event_name: string;
  background_image: string;
  background_thumbnail_image: string;
  social_background_image: string;
  background_pan: number;
  gradient_color: string;
  currency: string;
  start_date: Date;
  end_date: Date;
  can_chip_in: boolean;
  can_donate: boolean;
  amount_type: string;
  amount: number;
  max_amount: number;
  has_currency_balance: boolean;
  pledge: number;
  txn_count: number;
  current_value: number;
  share_progress: boolean;
  share_contributions: boolean;
  share_contributors: boolean;
}

export interface PaypalOwner {
  first_name: string;
  last_name: string;
  full_name: string;
  business_name: string;
  profile_photo: string;
  email: null;
  email_confirmed: boolean;
  id: string;
  prepaid_status: string;
}

export interface PaypalMoneyPool {
  description: string;
  title: string;
  amount: number;
  payment_counts: number;
  total_value: number;
  currency: string;
  orders: Orders[];
}
