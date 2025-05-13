#!/usr/bin/env node

//You're task is to build expense-cli using commander and fs module.
//1) You should have CRUD - craete, read, update, delete, getById functionality.
//Each expense should have minimum 4 field, category, price, id, createdAt this is requied, you should also add other fields its depends on you.
//2) When you create new expense system itself should set createdAt prop, accordingly  when you run expense-cli show --asc or --desc it should return sorted expenses by createdAt prop.
//3) Add filters expense-cli show -c or --category shopping, should returns all expenses which categories are shopping.
//4) You should add search by date functionality. expense-cli search 2025-01-02 should return all expenses from 2025 Jan 2.
//5) You should have validation each expense creation time, like if expense is less than 10 throw some error.

import { Command } from "commander";
import { readFile, writeFile } from "./utils.js";

const program = new Command();

program
  .name("expenses Cli tool")
  .description("Hard expenses crud")
  .version("1.0.0");

program
  .command("add")
  .argument("<product>")
  .argument("<category>")
  .argument("<price>")
  .action(async (product, category, price) => {
    const expenses = await readFile("expenses.json", true);
    const lastId = expenses[expenses.length - 1]?.id || 0;

    const isExistedproduct = expenses.find(
      (expense) => expense.product === product
    );

    if (isExistedproduct) {
      console.log("this product alreadt exists!");
      return;
    }

    if (Number(price) < 10) {
      console.log("please try a different price, above 10$");
      return;
    }

    const newExpense = {
      id: lastId + 1,
      product,
      category,
      price: Number(price),
      date: new Date().toISOString(),
    };

    expenses.push(newExpense);
    await writeFile("expenses.json", JSON.stringify(expenses));
  });

program
  .command("delete")
  .argument("<id>")
  .action(async (id) => {
    const expenses = await readFile("expenses.json", true);
    const index = expenses.findIndex((el) => el.id === Number(id));

    if (index === -1) {
      console.log("cannot delete");
      return;
    }

    const deletedItem = movies.splice(index, 1);
    await writeFile("expenses.json", JSON.stringify(movies));
    console.log("deleted successfully", deletedItem);
  });

program
  .command("update")
  .argument("<id>")
  .option("-p, --product <product>")
  .option("-c, --category <category>")
  .option("-m, --money <price>")
  .action(async (id, opts) => {
    const expenses = await readFile("expenses.json", true);
    const index = expenses.findIndex((el) => el.id === Number(id));
    if (index === -1) {
      console.log("cannot delete");
      return;
    }
    if (opts.price) {
      opts.price = Number(opts.price);
    }
    expenses[index] = {
      ...expenses[index],
      ...opts,
    };
    await writeFile("expenses.json", JSON.stringify(movies));
    console.log("updated successfully", expenses[index]);
  });

program
  .command("show")
  .option("-a, --ascending")
  .option("-d, --descending")
  .option("-c, --category <category>")
  .action(async (opts) => {
    let expenses = await readFile("expenses.json", true);

    if (opts.category) {
      expenses = expenses.filter(
        (e) => e.category.toLowerCase() === opts.category.toLowerCase()
      );
    }

    if (opts.ascending) {
      expenses.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    if (opts.descending) {
      expenses.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    console.log(expenses);
  });
program
  .command("search")
  .argument("<date>")
  .action(async (date) => {
    const expenses = await readFile("expenses.json", true);
    const result = expenses.filter((e) => e.date.startsWith(date));
    if (result.length === 0) {
      console.log("no expenses found on that date");
      return;
    }
    console.log(result);
  });

program.parse();
