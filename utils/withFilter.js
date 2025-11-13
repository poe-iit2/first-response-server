// Don't change

import { $$asyncIterator } from "iterall";

export function withFilter(
  asyncIteratorFn,
  filterFn
) {
  return (args, context, info) => {
    const asyncIterator = asyncIteratorFn(args, context, info);

    const getNextPromise = () => {
      return new Promise((resolve, reject) => {

        const inner = () => {
          asyncIterator
            .next()
            .then(payload => {
              if (payload.done === true) {
                resolve(payload);
                return;
              }
              Promise.resolve(filterFn(payload.value, args, context, info))
                .catch(() => false) // We ignore errors from filter function
                .then(filterResult => {
                  if (filterResult === true) {
                    resolve(payload);
                    return;
                  }
                  // Skip the current value and wait for the next one
                  inner();
                  return;
                });
            })
            .catch((err) => {
              reject(err);
              return;
            });
        };

        inner();

      });
    };

    const asyncIterator2 = {
      next() {
        return getNextPromise();
      },
      return() {
        return asyncIterator.return();
      },
      throw(error) {
        return asyncIterator.throw(error);
      },
      [$$asyncIterator]() {
        return this;
      },
    };

    return asyncIterator2;
  };
};
