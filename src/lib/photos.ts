import imgMeta from "../data_img_meta.json";
import fimgMeta from "../data_fimg_meta.json";

export interface PhotoCredit {
  page: string;
  license: string;
  artist: string;
}

const base = import.meta.env.BASE_URL;

export const TRAIL_CREDIT = imgMeta as Record<string, PhotoCredit>;
export const FOOD_META = fimgMeta as Record<string, PhotoCredit & { file: string }>;

export function trailPhoto(id: string): string | null {
  return id in TRAIL_CREDIT ? `${base}imgs/c_${id}.jpg` : null;
}

export function foodPhoto(name: string): string | null {
  const m = FOOD_META[name];
  return m ? `${base}fimgs/c_${m.file}.jpg` : null;
}

export function foodCredit(name: string): PhotoCredit | undefined {
  return FOOD_META[name];
}
