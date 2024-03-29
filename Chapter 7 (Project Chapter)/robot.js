//Provided Chapter Code. Scroll down for my edits. 

var roads = [
  "Alice's House-Bob's House",   "Alice's House-Cabin",
  "Alice's House-Post Office",   "Bob's House-Town Hall",
  "Daria's House-Ernie's House", "Daria's House-Town Hall",
  "Ernie's House-Grete's House", "Grete's House-Farm",
  "Grete's House-Shop",          "Marketplace-Farm",
  "Marketplace-Post Office",     "Marketplace-Shop",
  "Marketplace-Town Hall",       "Shop-Town Hall"
];

function buildGraph(edges) {
  let graph = Object.create(null);
  function addEdge(from, to) {
    if (graph[from] == null) {
      graph[from] = [to];
    } else {
      graph[from].push(to);
    }
  }
  for (let [from, to] of edges.map(r => r.split("-"))) {
    addEdge(from, to);
    addEdge(to, from);
  }
  return graph;
}

var roadGraph = buildGraph(roads);

var VillageState = class VillageState {
  constructor(place, parcels) {
    this.place = place;
    this.parcels = parcels;
  }

  move(destination) {
    if (!roadGraph[this.place].includes(destination)) {
      return this;
    } else {
      let parcels = this.parcels.map(p => {
        if (p.place != this.place) return p;
        return {place: destination, address: p.address};
      }).filter(p => p.place != p.address);
      return new VillageState(destination, parcels);
    }
  }
}

function runRobot(state, robot, memory) {
  for (let turn = 0;; turn++) {
    if (state.parcels.length == 0) {
      console.log(`Done in ${turn} turns`);
      break;
    }
    let action = robot(state, memory);
    state = state.move(action.direction);
    memory = action.memory;
    console.log(`Moved to ${action.direction}`);
  }
}

function randomPick(array) {
  let choice = Math.floor(Math.random() * array.length);
  return array[choice];
}

function randomRobot(state) {
  return {direction: randomPick(roadGraph[state.place])};
}

VillageState.random = function(parcelCount = 5) {
  let parcels = [];
  for (let i = 0; i < parcelCount; i++) {
    let address = randomPick(Object.keys(roadGraph));
    let place;
    do {
      place = randomPick(Object.keys(roadGraph));
    } while (place == address);
    parcels.push({place, address});
  }
  return new VillageState("Post Office", parcels);
};

var mailRoute = [
  "Alice's House", "Cabin", "Alice's House", "Bob's House",
  "Town Hall", "Daria's House", "Ernie's House",
  "Grete's House", "Shop", "Grete's House", "Farm",
  "Marketplace", "Post Office"
];

function routeRobot(state, memory) {
  if (memory.length == 0) {
    memory = mailRoute;
  }
  return {direction: memory[0], memory: memory.slice(1)};
}

function findRoute(graph, from, to) {
  let work = [{at: from, route: []}];
  for (let i = 0; i < work.length; i++) {
    let {at, route} = work[i];
    for (let place of graph[at]) {
      if (place == to) return route.concat(place);
      if (!work.some(w => w.at == place)) {
        work.push({at: place, route: route.concat(place)});
      }
    }
  }
}

function goalOrientedRobot({place, parcels}, route) {
  if (route.length == 0) {
    let parcel = parcels[0];
    if (parcel.place != place) {
      route = findRoute(roadGraph, place, parcel.place);
    } else {
      route = findRoute(roadGraph, place, parcel.address);
    }
  }
  return {direction: route[0], memory: route.slice(1)};
}

//Chapter Excercises

//Excercise 1: Robot Efficiency 
// Creates 100 tasks for two different robots to run.
// Return avg. number of completion moves for each robot. 

//Runs robot and returns number of moves
function runRobotMoves(state, robot, memory) {
    for (let turn = 0;; turn++) {
      if (state.parcels.length == 0) {
        return turn;
      }
      let action = robot(state, memory);
      state = state.move(action.direction);
      memory = action.memory;
    }
  }

//Compares two robots by having each robot complete 100 tasks
//Prints avg. number of moves to complete task for each robot
function compareRobots(robot1, memory1, robot2, memory2) {
    let robot1Log = [], robot2Log = [];
    for (let i=0; i<100; i++) {
        let state = VillageState.random();
        robot1Log.push(runRobotMoves(state, robot1, memory1));
        robot2Log.push(runRobotMoves(state, robot2, memory2)); 
    }
    function avgMoves (robotLog) {
        return robotLog.reduce((x,y) => x + y) / robotLog.length; 
    }
    console.log("Robot1 avg. moves: " + avgMoves(robot1Log) + 
        "\nRobot2 avg. moves: " + avgMoves(robot2Log));
}

//Exercise 2
//Create a robot that is more efficient than goalOrientedRobot

//instead of finding the most efficient route to the next parcel,
//this function looks at all parcels and then chooses the most 
//efficient route to the nearest parcel
function yourRobot({place, parcels}, route) {
    let routeOption = [];
    if (route.length == 0) {
      for (let parcel of parcels) {
              if (parcel.place != place) {
            routeOption = findRoute(roadGraph, place, parcel.place);
          } else {
                routeOption = findRoute(roadGraph, place, parcel.address);
          }
            if (route.length == 0) {
            route = routeOption;
          }
            else if (routeOption.length < route.length) {
            route = routeOption;
          }
        }
    }
    return {direction: route[0], memory: route.slice(1)};
  }
  runRobot(VillageState.random(), yourRobot, []);
  
  compareRobots(yourRobot, [], goalOrientedRobot, []);

//incrementally improves my robot by favoring picking up a parcel
//instead of deliveringa parcel when the route lengths are equal
//this is a very small improvement, but it is an improvement on average
function yourRobot2({place, parcels}, route) {
    let routeOption = [];
    let pickupKey;
    if (route.length == 0) {
      for (let parcel of parcels) {
              if (parcel.place != place) {
            routeOption = findRoute(roadGraph, place, parcel.place);
            pickupKey = 1;
          } else {
                routeOption = findRoute(roadGraph, place, parcel.address);
            pickupKey = 0;
          }
            if (route.length == 0) {
            route = routeOption;
          }
            else if (routeOption.length < route.length) {
            route = routeOption;
          }
            else if (routeOption.length == route.length && pickupKey == 1) {
            route = routeOption;
          }
        }
    }
    return {direction: route[0], memory: route.slice(1)};
  }
  
  compareRobots(yourRobot, [], yourRobot2, [])

  //Exercise 3
  //This exercise is independent from the rest of the Ch. 7 code 
  //Creat a simplified version of a set, but which uses persistent data
  //PGroup has add, delete, and has methods
  
  class PGroup {
    constructor (array = []) {
        this.members=array;
    }
    
    //add
    add(x) {
      if (this.has(x)) return this;  
      return new PGroup(this.members.concat(x));
    }
    
    //delete
    delete(x) {
      if (!this.has(x)) return this;
      return new PGroup(this.members.filter(y => y !== x));
    }
    
    //has
    has (x) {
      if (this.members.indexOf(x) == -1)
        return false;
      return true;
    }
  }
  
  PGroup.empty = new PGroup;
  
  let a = PGroup.empty.add("a");
  let ab = a.add("b");
  let b = ab.delete("a");
  console.log(b.has("b"));
  // → true
  console.log(a.has("b"));
  // → false
  console.log(b.has("a"));
  // → false