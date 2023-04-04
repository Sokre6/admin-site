export const STATUS = ["DRAFT", "PUBLISHED", "FUTURE", "RETIRED"];
/*  */
export const getLocalizedName = (inputArray, locale) => {
 
  let defaultName = "";
  let localizedName = "";
  for (let i = 0; i < inputArray?.length; i++) {
    if (inputArray[i].locale === locale) {
      localizedName = inputArray[i].name;
    } else if (inputArray[i].locale === "en") {
      defaultName = inputArray[i].name;
    }
  }

  return localizedName !== "" ? localizedName : defaultName;
};

/*  */
export const getLocalizedPostTitles = (inputArray, locale) => {
 
  let defaultName = "";
  let localizedName = "";
  for (let i = 0; i < inputArray.length; i++) {
    if (inputArray[i].locale === locale) {
      localizedName = inputArray[i].title;
    } else if (inputArray[i].locale === "en") {
      defaultName = inputArray[i].title;
    }
  }

  return localizedName !== "" ? localizedName : defaultName;
};
/*  */
export const areObjectAttributesNullorEmptyString = (obj) => {
  const arr = Object.values(obj);
  arr.pop();

  return arr.every((element) => element === null || element === "");
};
/*  */

export const getBlogCategoryById = (id, data) => {
  if (id !== null && id !== undefined) {
    const blogCategoryById = data.filter((item) => item.id === id);
    return blogCategoryById[0]?.names;
  } else {
    return "";
  }
};
/*  */
export const getAuthorsById = (id, data) => {
  if (id !== null && id !== undefined) {
    const authorById = data.filter((item) => item.id === id);
    return `${authorById[0]?.givenName} ${authorById[0]?.familyName}`
  } else {
    return "";
  }
};
