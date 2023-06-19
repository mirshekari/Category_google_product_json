// تعریف یک آرایه برای ذخیره دسته‌بندی‌ها

let categories = [];

// دریافت فایل دسته‌بندی گوگل به صورت TSV

fetch("http://www.google.com/basepages/producttype/taxonomy-with-ids.en-US.txt")

  .then(response => response.text())

  .then(data => {

    // تبدیل TSV به شیء Array

    const rows = data.trim().split('\n').map(row => row.split('\t'));

    // تعریف یک شیء Object برای ذخیره دسته‌بندی‌ها به صورت درختی

    const tree = {};

    // ایجاد لیست درخت دسته‌بندی‌ها

    for (let i = 0; i < rows.length; i++) {

      const row = rows[i];

      const categoryId = row[1];

      const categoryName = row[0];

      const categoryPath = row[2];

      let path = categoryPath.split(" > ");

      let current = tree;

      for (let j = 0; j < path.length; j++) {

        if (!current[path[j]]) {

          current[path[j]] = {};

        }

        current = current[path[j]];

      }

      current["__categoryId__"] = categoryId;

      current["__categoryName__"] = categoryName;

    }

    // تبدیل درخت دسته‌بندی‌ها به آرایه

    function treeToArray(tree, parent = "") {

      const result = [];

      for (const key in tree) {

        if (key.startsWith("__")) {

          continue;

        }

        const categoryId = tree[key]["__categoryId__"];

        const categoryName = tree[key]["__categoryName__"];

        const fullPath = parent ? `${parent} > ${key}` : key;

        const item = {

          id: categoryId,

          name: categoryName,

          path: fullPath

        };

        if (Object.keys(tree[key]).length > 2) {

          item.children = treeToArray(tree[key], fullPath);

        }

        result.push(item);

      }

      return result;

    }

    // تبدیل درخت دسته‌بندی‌ها به آرایه JSON

    categories = treeToArray(tree);

    // نمایش دسته‌بندی‌ها به صورت JSON

    console.log(JSON.stringify(categories));

  });
