// all default values
type configOpts = {
  tokens: number,
  temp: number,
  top_p: number,
  freq_pen: number,
  pres_pen: number,
}
export const default_config: configOpts = {
  tokens: 256,
  temp : 1,
  top_p : 1,
  freq_pen : 0,
  pres_pen : 0,
}
