import { 
  MenuItem, 
  SpecialRecipeItem, 
  OfferItem, 
  EventItem, 
  ChefMember, 
  ReviewItem, 
  GalleryItem, 
  RestaurantConfig,
  DessertBarItem,
  DealItem,
  NashtaPointItem,
  NashtaPointConfig,
  SoftDrinkItem
} from '../types';
import {
  RESTAURANT_CONFIG,
  MENU_ITEMS,
  SPECIAL_RECIPES,
  OFFERS,
  EVENTS,
  CHEFS,
  GALLERY_ITEMS,
  REVIEWS,
  DESSERT_BAR_ITEMS,
  DEFAULT_DEMO_QR_CODE,
  DEALS,
  DEFAULT_NASHTA_CONFIG,
  NASHTA_POINT_ITEMS,
  SOFT_DRINKS
} from './restaurantData';

export const INITIAL_RESTAURANT_CONFIG: RestaurantConfig = RESTAURANT_CONFIG;
export const INITIAL_DEFAULT_DEMO_QR_CODE = DEFAULT_DEMO_QR_CODE;
export const INITIAL_MENU_ITEMS: MenuItem[] = MENU_ITEMS;
export const INITIAL_DEALS: DealItem[] = DEALS;
export const INITIAL_SPECIAL_RECIPES: SpecialRecipeItem[] = SPECIAL_RECIPES;
export const INITIAL_OFFERS: OfferItem[] = OFFERS;
export const INITIAL_EVENTS: EventItem[] = EVENTS;
export const INITIAL_CHEFS: ChefMember[] = CHEFS;
export const INITIAL_GALLERY_ITEMS: GalleryItem[] = GALLERY_ITEMS;
export const INITIAL_REVIEWS: ReviewItem[] = REVIEWS;
export const INITIAL_DESSERT_BAR_ITEMS: DessertBarItem[] = DESSERT_BAR_ITEMS;
export const INITIAL_NASHTA_CONFIG: NashtaPointConfig = DEFAULT_NASHTA_CONFIG;
export const INITIAL_NASHTA_ITEMS: NashtaPointItem[] = NASHTA_POINT_ITEMS;
export const INITIAL_SOFT_DRINKS: SoftDrinkItem[] = SOFT_DRINKS;

