import { getShowcaseSheets } from "../lib/showcase-assets";
import WebflowShowcaseGallery from "./WebflowShowcaseGallery";

export default function ShowcaseSection() {
  return <WebflowShowcaseGallery sheets={getShowcaseSheets()} />;
}
