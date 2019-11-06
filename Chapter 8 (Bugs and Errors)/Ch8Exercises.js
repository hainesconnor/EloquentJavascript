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

//Exercise 2
// Suppose there is this box object with a lock
//Write a funciton that takes a funciton as an argument, unlocks the box, runs the funcition, and then ensures the box is locked again

const box = {
  locked: true,
  unlock() { this.locked = false; },
  lock() { this.locked = true;  },
  _content: [],
  get content() {
    if (this.locked) throw new Error("Locked!");
    return this._content;
  }
};

function withBoxUnlocked(body) {
  // Your code here.
  if (!box.locked) {
    return body();
  }
  box.unlock()
  try {
  return body();
  } finally {
    box.lock();
  }	  
}

withBoxUnlocked(function() {
  box.content.push("gold piece");
});

try {
  withBoxUnlocked(function() {
    throw new Error("Pirates on the horizon! Abort!");
  });
} catch (e) {
  console.log("Error raised: " + e);
} 

console.log(box.locked);