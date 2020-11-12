export class ArrayHelper {
  public static sortArrayByDate(arr: Array<any>, type: 'ASC' | 'DESC', by: string): Array<any> {
    return arr.sort((first, second) => {
      const firstDate = new Date(first[by]);
      const secondDate = new Date(second[by]);

      const compared = firstDate.getTime() - secondDate.getTime();

      return type === 'ASC' ? compared : -compared;
    });
  }

  public static orderItems(arr: Array<any>, currentIndex: number, expectIndex: number): Array<any> {
    const swapItem = arr[currentIndex];
    let i = currentIndex;

    if (currentIndex < expectIndex) {
      while (i <= expectIndex) {
        arr[i] = { ...arr[i + 1] };

        if (i === expectIndex) {
          arr[i] = { ...swapItem };
        }
        i++;
      }

      return arr;
    }

    while (i >= expectIndex) {
      arr[i] = { ...arr[i - 1] };

      if (i === expectIndex) {
        arr[i] = { ...swapItem };
      }

      i--;
    }

    return arr;
  }

  public static replaceWith(arr: Array<any>, replaceWith: any, replaceAt: (replaceItem: any, atItem: any) => boolean) {
    const index = arr.findIndex(it => replaceAt(replaceWith, it));
    if (index > -1) {
      arr[index] = { ...replaceWith };
    }

    return arr;
  }

  public static removeItem(arr: Array<any>, predicate: (item: any) => boolean): Array<any> {
    const removeIndex = arr.findIndex(it => predicate(it));

    if (removeIndex >= 0) {
      arr.splice(removeIndex, 1);
    }

    return arr;
  }

  public static includes(rootArr: Array<any>, validateArr: Array<any>, typeCompare: 'And' | 'Or' = 'Or'): boolean {
    for (let i = 0; i < rootArr.length; i++) {
      if (!validateArr[i]) {
        return false;
      }

      const existed = rootArr.some(it => it === validateArr[i]);

      if (existed && typeCompare === 'Or') {
        return existed;
      }

      if (!existed && typeCompare === 'And') {
        return existed;
      }
    }

    return typeCompare === 'And';
  }

  public static groupBy(arr: Array<any>, groupBy: string): any {
    const groups = arr.reduce(function (r, a) {
      r[a[groupBy]] = r[a[groupBy]] || [];
      r[a[groupBy]].push(a);
      return r;
    }, Object.create(null));

    return groups;
  }

  /**
   * only run with data as an object
   * ex: data = { children: [{ children: [], ...something }, { children: [], ...something }], ...something }
   */
  public static flattenDeep(data: any, flattenBy: string) {
    const flatten = (input, flattenBy: string) => {
      const stack = [...input];
      const res = [];

      while (stack.length) {
        // pop value from stack
        const next = stack.pop();
        if (Array.isArray(next[flattenBy])) {
          // push back array items, won't modify the original input
          stack.push(...next[flattenBy]);
        } else {
          res.push(next);
        }
      }

      // reverse to restore input order
      return res.reverse();
    };

    const resultFlatten = data[flattenBy]
      ? flatten(data[flattenBy], flattenBy)
      : [data];
    return resultFlatten;
  }

  public static joinBy(arr: Array<any>, joinBy: string, join: string = ', ') {
    let result = '';

    arr.map((it, index) => {
      result += index === arr.length - 1 ? it[joinBy] : it[joinBy] + join;
    });

    return result;
  }

  public static getUniqueBy(arr: Array<any>, uniqueBy: string): Array<any> {
    return arr.filter((v, i, a) => a.indexOf(v) === i);
  }

  public static maxBy(arr: Array<any>, by: string): any {
    return arr.reduce((a, b) => {
      Math.max(a[by], b[by]);
    });
  }

  public static replace(
    arr: Array<any>,
    item: any,
    indicator: (replace, replaceWith) => boolean
  ): Array<any> {
    return arr.map((a) => (indicator(a, item) ? item : a));
  }
}
