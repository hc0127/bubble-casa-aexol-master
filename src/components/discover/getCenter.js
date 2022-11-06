export const getCenterOfElement = (element) => {
    let x = $(element).offset().left + $(element).outerWidth() / 2;
    let y = $(element).offset().top + $(element).outerHeight() / 2;
    let coordinates = { x, y };
    return coordinates;
  }

  // export const calculateDistance = (coordinates1, coordinates2) => {
  //   let h = coordinates1.x - coordinates2.x;
  //   let v = coordinates1.y - coordinates2.y;
  //   let result = Math.sqrt(h * h + v * v);
  //   return result;
  // }

  export const calculateDistance = (screenCenter, elementCenter) => {
    const distance = Math.sqrt(
      Math.pow(screenCenter.x - elementCenter.x, 2) +
        Math.pow(screenCenter.y - elementCenter.y, 2)
    );
    return distance
  }

  export const mouseCalculateDistance = (elem, mouseX, mouseY) => {
    return Math.floor(Math.sqrt(Math.pow(mouseX - (elem.offset().left+(elem.width()/2)), 2) + Math.pow(mouseY - (elem.offset().top+(elem.height()/2)), 2)));
}