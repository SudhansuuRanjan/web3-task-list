import { useEffect, useState } from "react";
import "./App.css";
import { ethers } from "ethers";
import TaskAbi from "./utils/TaskContract.json";
import { TaskContractAddress } from "./config";
import Tasks from "./components/Tasks";

function App() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [currentAccount, setCurrentAccount] = useState("");
  const [correctNetwork, setCorrectNetwork] = useState(false);

  const getAllTasks = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const TaskContract = new ethers.Contract(
          TaskContractAddress,
          TaskAbi.abi,
          signer
        );

        let allTasks = await TaskContract.getMyTasks();
        setTasks(allTasks);
      } else {
        console.log("Ethereum object doesn't exist");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllTasks();
  }, [tasks]);

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Metamask not detected");
        return;
      }

      let chainId = await ethereum.request?.({ method: "eth_chainId" });
      console.log("Connected to chain:" + chainId);
      const rinkebyChainId = "0x5";

      if (chainId !== rinkebyChainId) {
        alert("You are not connected to the Rinkeby Testnet!");
        setCurrentAccount(".");
        return;
      } else {
        setCorrectNetwork(true);
      }

      const accounts = await ethereum.request?.({
        method: "eth_requestAccounts",
      });

      console.log("Found account", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log("Error connecting to metamask", error);
    }
  };

  const addTask = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();

    let task = {
      taskText: input,
      isDeleted: false,
    };

    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const TaskContract = new ethers.Contract(
          TaskContractAddress,
          TaskAbi.abi,
          signer
        );

        TaskContract.addTask(task.taskText, task.isDeleted)
          .then((response: any) => {
            setTasks([...tasks, task]);
            console.log("Completed Task");
          })
          .catch((err: any) => {
            console.log("Error occured while adding a new task");
          });
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (err) {
      console.log("Error submitting new Task", err);
    }

    setInput("");
  };

  const handleDelete = async (key: number) => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const TaskContract = new ethers.Contract(
          TaskContractAddress,
          TaskAbi.abi,
          signer
        );

        await TaskContract.deleteTask(key, true);
        let allTasks = await TaskContract.getMyTasks();
        setTasks(allTasks);
      } else {
        console.log("Ethereum object doesn't exist");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect(() => {
  //   connectWallet();
  // }, []);

  return (
    <div className="flex">
      {currentAccount === "" ? (
        <div className="flex flex-col items-center justify-center m-auto">
          <h2 className="text-4xl font-bold mt-60"> Task Management App</h2>
          <button
            className="py-2.5 px-6 text-sm bg-[#00601b] rounded-xl font-semibold mb-10 hover:scale-105 hover:border-green-300 transition duration-500 ease-in-out border-green-500 border mt-10"
            onClick={connectWallet}
          >
            Connect Wallet
          </button>
        </div>
      ) : correctNetwork ? (
        <div className="m-auto w-[100%]">
          <div className="mt-12">
            <h2 className="text-4xl font-bold text-center">
              {" "}
              Task Management App
            </h2>
            <p className="text-center mt-3 text-sm text-gray-400">
              User : {currentAccount}
            </p>
          </div>

          <div className="m-auto mt-16 w-[60%]">
            <form className="flex items-center justify-between">
              <div>
                <label htmlFor="task"></label>
                <input
                  value={input}
                  className="py-2.5 w-[150%] px-5 border-zinc-500  border rounded-xl"
                  type="text"
                  placeholder="Enter Todo"
                  onChange={(e) => setInput(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="py-2.5 px-6 text-sm bg-[#00601b] rounded-xl font-semibold mb-10 hover:scale-105 hover:border-green-300 transition duration-500 ease-in-out border-green-500 border mt-10"
                onClick={addTask}
              >
                Add Todo
              </button>
            </form>

            <div>
              {tasks.map((task, index) => (
                <Tasks
                  key={index}
                  taskText={task.taskText}
                  onClick={() => handleDelete(task.id)}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center mb-20 font-bold text-2xl gap-y-3 m-auto mt-48">
          <div className="text-red-500">
            ----------------------------------------
          </div>
          <div>Please connect to the Georli Testnet</div>
          <div>and reload the page.</div>
          <div className="text-red-500">
            ----------------------------------------
          </div>

          <button
            className="py-2.5 px-6 text-sm bg-[#600028] rounded-xl font-semibold mb-10 hover:scale-105 hover:border-red-400 transition duration-500 ease-in-out border-red-500 border mt-10"
            onClick={() => window.location.reload()}
          >
            Click to reload!
          </button>
        </div>
      )}

      <div className="absolute bottom-5 w-[100%]">
        <p className="text-center">
          Made with ❤️ by{" "}
          <a
            href="https://sudhanshuranjan.live"
            className="text-violet-500 text-lg font-semibold cursor-pointer"
          >
            Sudhanshu Ranjan
          </a>
          .
        </p>
      </div>
    </div>
  );
}

export default App;
