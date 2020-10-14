import { HttpParams } from "@angular/common/http";

export const createRequestParam = (req?: any): HttpParams => {
  let options: HttpParams = new HttpParams();
  if (req) {
    Object.keys(req).forEach((key) => {
      const value = req[key];

      if (value === undefined) {
        return;
      }

      if (value instanceof Array) {
        Object.values(value).forEach((v) => {
          options = options.append(key, v);
        });
      } else {
        options = options.set(key, value);
      }
    });
  }
  return options;
};
