import checkInImage from "../assets/check-in.png";

export { checkInImage };

export function preloadCheckInImage() {
  const img = new Image();
  img.src = checkInImage;
}
