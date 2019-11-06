//Included chapter code
//Scroll down for my solutions to chapter exercises

var accounts = {
  a: 100,
  b: 0,
  c: 20
};

function getAccount() {
  let accountName = prompt("Enter an account name");
  if (!accounts.hasOwnProperty(accountName)) {
    throw new Error(`No such account: ${accountName}`);
  }
  return accountName;
}

function transfer(from, amount) {
  if (accounts[from] < amount) return;
  accounts[from] -= amount;
  accounts[getAccount()] += amount;
}

function transfer(from, amount) {
  if (accounts[from] < amount) return;
  let progress = 0;
  try {
    accounts[from] -= amount;
    progress = 1;
    accounts[getAccount()] += amount;
    progress = 2;
  } finally {
    if (progress == 1) {
      accounts[from] += amount;
    }
  }
}

var InputError = class InputError extends Error {}

function promptDirection(question) {
  let result = prompt(question);
  if (result.toLowerCase() == "left") return "L";
  if (result.toLowerCase() == "right") return "R";
  throw new InputError("Invalid direction: " + result);
}


//Exercises

//Exercise 1
//Suppsoe a 'primitive' multplier only works 20% of the time. Write a 'realiable' multiplier funciton that
//keeps calling the primitive multipier until it works. 

class MultiplicatorUnitFailure extends Error {}

function primitiveMultiply(a, b) {
  if (Math.random() < 0.2) {
    return a * b;
  } else {
    throw new MultiplicatorUnitFailure("Klunk");
  }
}

function reliableMultiply(a, b) {
  // Your code here.
    try {
      return primitiveMultiply(a, b);
    } catch (e) {
      if (e instanceof MultiplicatorUnitFailure) return reliableMultiply(a, b);
      else throw (e);
    }    
}

console.log(reliableMultiply(8, 8));

