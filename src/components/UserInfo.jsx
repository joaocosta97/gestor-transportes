function UserInfo() {
    const username = localStorage.getItem('username');
  
    if (!username) return null;
  
    return (
      <div className="absolute top-4 left-4 bg-gray-200 text-gray-800 px-4 py-2 rounded">
        Olá, <span className="font-bold">{username}</span>!
      </div>
    );
  }
  
  export default UserInfo;
  