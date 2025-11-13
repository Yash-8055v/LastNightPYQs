function Login() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-gray-800 text-white p-8 rounded-xl shadow-lg w-80">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <form className="flex flex-col space-y-4">
          <input type="text" placeholder="Username" className="p-2 rounded bg-gray-700 border border-gray-600" />
          <input type="password" placeholder="Password" className="p-2 rounded bg-gray-700 border border-gray-600" />
          <button className="bg-blue-500 hover:bg-blue-600 p-2 rounded text-white">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
