export const validateEmail = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

export const toBoolean = (value: string) => {
  return value === "true";
};

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

export const isValidUrl = (str: string) => {
  try {
    return Boolean(new URL(str));
  } catch (e) {
    return false;
  }
};

export const getHostName = (url: string) => {
  var match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
  if (match != null && match.length > 2 && typeof match[2] === "string" && match[2].length > 0) {
    var hostname = match[2].split(".");
    return hostname[0];
  } else {
    return null;
  }
};

export const scrollAnchorIntoView = (): void => {
  const hash = window.location.hash;
  if (hash) {
    const ele = document.querySelector(hash);
    if (ele) {
      ele.scrollIntoView({ behavior: "smooth" });
    }
  }
};
