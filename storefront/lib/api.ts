const fallbackApi = "https://magnetique.onrender.com"

export const API =
  process.env.NEXT_PUBLIC_MEDUSA_URL?.replace(/\/$/, "") || fallbackApi
