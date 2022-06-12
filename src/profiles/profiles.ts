import { IAltAxProfile } from "../chromeServices/profile-applicator"
import { YouTubeProfile } from "./youtube"


export const Profiles: Record<string, IAltAxProfile> = {
    "www.youtube.com": YouTubeProfile,
}