import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];
function Button({ onClick, children }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}
function App() {
  const [display, setDisplay] = useState(false);
  const [friends, setFriend] = useState(initialFriends);
  const [friendName, setFriendName] = useState("");
  const [imageUrl, setImageUrl] = useState("https://i.pravatar.cc/48");
  const [selected, setSelected] = useState(null);

  function handleShowAddFriend() {
    setDisplay((display) => !display);
  }
  function handleSelection(friend) {
    setSelected((curr) => (curr?.id === friend.id ? null : friend));
    setDisplay(false);
  }
  function handleSplitBill(value){
    setFriend((friends)=>friends.map((el)=>el.id===selected.id?{...el,balance:el.balance+value}:el))
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friends={friends}
          selected={selected}
          onSelection={handleSelection}
        />
        {display && (
          <FormAddFriend
            display={display}
            friends={friends}
            friendName={friendName}
            imageUrl={imageUrl}
            setFriend={setFriend}
            setFriendName={setFriendName}
            setImageUrl={setImageUrl}
          />
        )}
        <Button onClick={handleShowAddFriend}>
          {display ? "close" : "add friend"}
        </Button>
      </div>
      {selected && <SplitBill key={selected.id} selected={selected}handleSplitBill={handleSplitBill}/>}
    </div>
  );
}
function FriendList({ friends, onSelection, selected }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          key={friend.id}
          friend={friend}
          selected={selected}
          onSelection={onSelection}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelection, selected }) {
  console.log("friend:", friend, "selected:", selected);
  const isSelected = selected && selected.id === friend.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h1>{friend.name}</h1>

      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owe you {friend.balance}
        </p>
      )}
      {friend.balance < 0 && (
        <p className="red">
          {" "}
          you owe {friend.name} {Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance === 0 && <p>you and {friend.name} are even</p>}
      <Button onClick={() => onSelection(friend)}>
        {isSelected ? "close" : "select"}
      </Button>
    </li>
  );
}
function FormAddFriend({
  friends,
  friendName,
  imageUrl,
  setFriend,
  setFriendName,
  setImageUrl,
}) {
  function submitHandler(event) {
    event.preventDefault();
    if (!friendName || !imageUrl) return;
    const id = crypto.randomUUID();
    const newObject = {
      id,
      image: `${imageUrl}?id=${id}`,
      name: friendName,
      balance: 0,
    };
    console.log(newObject);
    setFriend((friend) => [...friend, newObject]);
    setFriendName("");
  }
  return (
    <form className="form-add-friend" onSubmit={submitHandler}>
      <label>👭Friend name</label>
      <input
        type="text"
        value={friendName}
        onChange={(e) => setFriendName(e.target.value)}
      />
      <label>🖼️Image URL</label>
      <input
        type="text"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
      />
      <Button>add</Button>
    </form>
  );
}
function SplitBill({ selected ,handleSplitBill}) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const paidByFriend= bill? bill-paidByUser:""
  
  const [whoIsPaying, setWhosIsPaying] = useState("user");

  function submitHandler(e){
e.preventDefault();
handleSplitBill(whoIsPaying==="user"? paidByFriend:-paidByUser)
  }
  return (
    <form className="form-split-bill" onSubmit={submitHandler}>
      <h2>split bill with {selected.name}</h2>
      <label>💰Bill Vlaue</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />
      <label>🧍Your Expense</label>
      <input
        type="text"
        value={paidByUser}
        disabled={whoIsPaying === "friend"} 
        onChange={(e) => setPaidByUser(Number(e.target.value)>bill?paidByUser:Number(e.target.value))}
      />
      <label>👬{selected.name} Expense</label>
      <input type="text" value={paidByFriend} disabled={whoIsPaying === "user"} />
      <label>🤑 who is paying the bill?</label>
      <select value={whoIsPaying} onChange={(e)=>setWhosIsPaying(e.target.value)}>
        <option value="user">you</option>
        <option value="friend">{selected.name}</option>
      </select>
      <Button >split bill</Button>
    </form>
  );
}
export default App;
