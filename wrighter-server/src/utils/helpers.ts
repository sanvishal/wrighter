// https://medium.com/dailyjs/web-developer-playbook-slug-a6dcbe06c284
export const slugify = (text: string) => {
  const a = "àáäâãåèéëêìíïîòóöôùúüûñçßÿœæŕśńṕẃǵǹḿǘẍźḧ·/_,:;";
  const b = "aaaaaaeeeeiiiioooouuuuncsyoarsnpwgnmuxzh------";
  const p = new RegExp(a.split("").join("|"), "g");
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(p, (c) => b.charAt(a.indexOf(c))) // Replace special characters in a with b
    .replace(/&/g, "-and-") // Replace & with ‘and’
    .replace(/[^\w-]+/g, "") // Remove all non-word characters such as spaces or tabs
    .replace(/--+/g, "-") // Replace multiple — with single -
    .replace(/^-+/, "") // Trim — from start of text
    .replace(/-+$/, ""); // Trim — from end of text
};

export const splitSlug = (slug: string) => {
  const splittedSlug = slug.split("-");
  const wrightId = splittedSlug[splittedSlug.length - 1];
  const restOfSplittedSlug = splittedSlug.slice(0, splittedSlug.length - 1);
  return { wrightId, slug: restOfSplittedSlug.join("-") };
};
