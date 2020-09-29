"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const cheerio_1 = __importDefault(require("cheerio"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const anonymous = {
    full_name: "Anonymous 🤓"
};
module.exports = function moneyPool(CAMPAIGN_ID) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield node_fetch_1.default('https://www.paypal.com/pools/c/' + CAMPAIGN_ID);
        if (res.status !== 200)
            throw new Error("money pool not found");
        const moneyPool = yield res.text();
        const $ = yield cheerio_1.default.load(moneyPool);
        const store = $("#store").html();
        const { campaign, contributors, txns } = yield JSON.parse(store);
        if (!campaign)
            throw new Error("money pool not found");
        let { description, title, amount, pledge, current_value, currency, txn_count: payment_counts } = campaign[CAMPAIGN_ID];
        let payments = txns.list;
        const users = contributors.map;
        // add oweners pledge to total amount
        current_value = current_value + pledge;
        const orders = payments.map((payment) => (Object.assign(Object.assign({}, payment), users[payment.contributor_id] || anonymous)));
        return { description, title, amount, current_value, payment_counts, currency, orders };
    });
};
