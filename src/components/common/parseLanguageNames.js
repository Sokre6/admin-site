

  export const parseLanguageNames = (languages, filteredLanguage) => {
    const arr=[]
    languages.forEach((elementA) =>
      filteredLanguage.forEach((elementB) => {
        if (elementA.code === elementB) {
          arr.push({
            value: elementB,
            label: elementA.names.find((i) => i.locale === "en").name,
          });
        }
      })
    );
    return arr;
  };