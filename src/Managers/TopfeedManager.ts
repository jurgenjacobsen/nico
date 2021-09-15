import { Collection, Snowflake } from 'discord.js';
import { Database } from 'dsc.db';
import { EventEmitter } from 'events';
import Twit, { Params } from 'twit';

export interface FeedManagerOptions {
  db: Database<any>;
  accounts: FeedAccountSettings[];
}

export interface FeedAccountSettings {
  twitter: string;
  roleID: Snowflake;
  channelID: Snowflake;
  time?: number;
}

export type FormatType = 'TWEET' | 'TWEETS' | 'USER' | 'USERS' | 'raw';
export type FetchResponse = Account | Accounts | Tweet | Tweets;

export type Accounts = Collection<string, Account>;
export type Tweets = Collection<string, Tweet>;

export type raw = object;

export class FeedManager {
  public db: Database<any>;
  public accounts: FeedWatcher[];

  constructor(options: FeedManagerOptions) {
    this.db = options.db;
    this.accounts = [];

    for (let feed of options.accounts) {
      let watcher = new FeedWatcher(feed, this.db);
      this.accounts.push(watcher);
    }
  }
}

export class FeedWatcher extends EventEmitter {
  private options: FeedAccountSettings;
  private db: Database<any>;
  private T: Twit;

  public account!: Account;

  constructor(options: FeedAccountSettings, db: Database<any>) {
    super();

    this.options = options;

    this.db = db;

    this.T = new Twit({
      consumer_key: process.env.TWITTER_CONSUMER as string,
      consumer_secret: process.env.TWITTER_CONSUMER_SECRET as string,
      access_token: process.env.TWITTER_ACCESS,
      access_token_secret: process.env.TWITTER_ACCESS_SECRET,
      timeout_ms: 60 * 1000,
    });
  }
}

export class Account {
  public id: string;
  public name: string;
  public username: string;
  public location: string;
  public description: string;
  public url: string | null;
  public entities: any[];
  public protected: boolean;
  public followers_count: number;
  public friends_count: number;
  public listed_count: number;
  public created_at: Date;
  public favourites_count: number;
  public verified: boolean;
  public statuses_count: number;
  public lastTweet: Tweet | Retweet | null;
  public profile_background_image_url_https: string | null;
  public profile_image_url_https: string | null;
  public profile_banner_url: string | null;
  public default_profile: boolean;
  public default_profile_image: boolean;
  public following: boolean;
  public follow_request_sent: boolean;
  public notifications: boolean;
  public withheld_in_countries: string[];
  public suspended: boolean;
  public needs_phone_verification: boolean;
  constructor(payload: any) {
    if (!payload) throw new Error("There's no payload for this");

    this.id = payload.id_str ?? `${payload.id}`;
    this.name = payload.name;
    this.username = payload.screen_name;
    this.location = payload.location;
    this.description = payload.description;
    this.url = payload.url ? payload.url : `https://twitter.com/${payload.screen_name}`;
    this.entities = payload.entities;
    this.protected = payload.protected;
    this.followers_count = payload.followers_count;
    this.friends_count = payload.friends_count;
    this.listed_count = payload.listed_count;
    this.created_at = new Date(payload.created_at);
    this.favourites_count = payload.favourites_count;
    this.verified = payload.verified;
    this.statuses_count = payload.statuses_count;
    this.lastTweet = payload.status && payload.status.is_quote_status ? new Retweet(payload.status) : payload.status ? new Tweet(payload.status) : null;
    this.profile_background_image_url_https = payload.profile_image_url_https ? payload.profile_image_url_https.replace('_normal', '') : null;
    this.profile_image_url_https = payload.profile_image_url_https;
    this.profile_banner_url = payload.profile_banner_url;
    this.default_profile = payload.default_profile;
    this.default_profile_image = payload.default_profile_image;
    this.following = payload.following;
    this.follow_request_sent = payload.follow_request_sent;
    this.notifications = payload.notifications;
    this.withheld_in_countries = payload.withheld_in_countries;
    this.suspended = payload.suspended;
    this.needs_phone_verification = payload.needs_phone_verification;
  }
}

/*
{

  contributors_enabled: false,
  is_translator: false,
  is_translation_enabled: false,
  profile_background_color: 'F5F8FA',
  profile_background_image_url: null,
  profile_background_image_url_https: null,
  profile_background_tile: false,
  profile_image_url: 'http://pbs.twimg.com/profile_images/1428757858515144706/FUIYOdCj_normal.jpg',
  profile_image_url_https: 'https://pbs.twimg.com/profile_images/1428757858515144706/FUIYOdCj_normal.jpg',
  profile_banner_url: 'https://pbs.twimg.com/profile_banners/815005759645880320/1629477501',
  profile_link_color: '1DA1F2',
  profile_sidebar_border_color: 'C0DEED',
  profile_sidebar_fill_color: 'DDEEF6',
  profile_text_color: '333333',
  profile_use_background_image: true,
  has_extended_profile: true,
  default_profile: true,
  default_profile_image: false,
  following: false,
  follow_request_sent: false,
  notifications: false,
  translator_type: 'none',
  withheld_in_countries: [],
  suspended: false,
  needs_phone_verification: false
}
*/

export class Tweet {
  constructor(payload: any) {}
}

export class Retweet extends Tweet {
  constructor(payload: any) {
    super(payload);
  }
}
